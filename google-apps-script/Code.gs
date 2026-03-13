/**
 * Japan Cyber Shield - メール通報自動処理 v2
 *
 * cybershield.jp@dropstone.co.jp (Google Group) 経由で
 * csj.report@dropstone.co.jp に転送されたメールを自動処理
 *
 * フロー:
 * 外部メール → Google Group → 本アカウント → Apps Script → JCS API → Supabase
 *
 * セットアップ:
 * 1. script.google.com で新規プロジェクト作成
 * 2. このコードを貼り付け
 * 3. スクリプトプロパティに API_SECRET を設定
 * 4. setup() を手動実行
 */

// ===== 設定 =====
const CONFIG = {
  API_URL: "https://cybershield-jp-drop-stone-ai.vercel.app/api/report/email",
  PROCESSED_LABEL: "JCS-処理済み",
  ERROR_LABEL: "JCS-エラー",
  SITE_URL: "https://cybershield-jp-drop-stone-ai.vercel.app",
  GROUP_EMAIL: "cybershield.jp@dropstone.co.jp",
  // Google Groupが付ける件名プレフィックスのパターン
  SUBJECT_PREFIX_REGEX: /^\[Cyber Shield Japan\]\s*/i,
};
/**
 * メイン処理: 未処理のメールを検索して通報APIに送信
 * トリガーで5分ごとに実行
 */
function processNewEmails() {
  const apiSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  if (!apiSecret) {
    Logger.log("ERROR: API_SECRET が設定されていません");
    return;
  }

  // 処理済みラベルを取得（なければ作成）
  let processedLabel = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!processedLabel) {
    processedLabel = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  }

  let errorLabel = GmailApp.getUserLabelByName(CONFIG.ERROR_LABEL);
  if (!errorLabel) {
    errorLabel = GmailApp.createLabel(CONFIG.ERROR_LABEL);
  }

  // 未処理メールを検索（inbox + spam両方、処理済みラベルを除外）
  // Google Group転送メールがspamに振り分けられることがあるため
  const queries = [
    `in:inbox -label:${CONFIG.PROCESSED_LABEL} -label:${CONFIG.ERROR_LABEL}`,
    `in:spam -label:${CONFIG.PROCESSED_LABEL} -label:${CONFIG.ERROR_LABEL} newer_than:1d`,
  ];

  let allThreads = [];
  for (const query of queries) {
    try {
      const threads = GmailApp.search(query, 0, 20);
      allThreads = allThreads.concat(threads);
    } catch (e) {
      Logger.log(`検索エラー (${query}): ${e.message}`);
    }
  }

  if (allThreads.length === 0) {
    Logger.log("新しいメールはありません");
    return;
  }

  Logger.log(`${allThreads.length} 件の未処理メールを発見`);

  for (const thread of allThreads) {
    try {
      const messages = thread.getMessages();
      const message = messages[0];

      // 自分自身からの自動返信はスキップ
      const myEmail = Session.getActiveUser().getEmail();
      if (message.getFrom().includes(myEmail)) {
        thread.addLabel(processedLabel);
        Logger.log(`⏭️ 自分からのメールをスキップ: ${message.getSubject()}`);
        continue;
      }

      const emailData = parseEmail(message);
      Logger.log(`📧 処理中: from=${emailData.from_email}, subject=${emailData.subject}`);
      Logger.log(`   reporter=${emailData.reporter_email}, original_subject=${emailData.original_subject}`);

      const result = sendToApi(emailData, apiSecret);

      if (result.success) {
        thread.addLabel(processedLabel);
        // spamからinboxに移動（返信できるように）
        if (thread.isInSpam && thread.isInSpam()) {
          thread.moveToInbox();
        }
        sendAutoReply(message, result.id, result.threat_type);
        Logger.log(`✅ 処理完了: ${emailData.subject} (ID: ${result.id})`);
      } else {
        thread.addLabel(errorLabel);
        Logger.log(`❌ API エラー: ${result.error}`);
      }
    } catch (e) {
      thread.addLabel(errorLabel);
      Logger.log(`❌ 処理エラー: ${e.message}\n${e.stack}`);
    }
  }
}

/**
 * メールを解析してAPI送信用データに変換
 * Google Group転送メールの形式を考慮:
 * - From: Google Groupのアドレスまたは元の送信者
 * - Subject: [Cyber Shield Japan] プレフィックスが付く
 * - Reply-To/X-Original-From: 元の送信者情報
 */
function parseEmail(message) {
  const body = message.getPlainBody() || "";
  const from = message.getFrom();
  const subject = message.getSubject();
  const replyTo = message.getReplyTo() || "";

  // 送信者名とメールアドレスを分離
  const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/);
  const fromName = fromMatch ? fromMatch[1].trim().replace(/"/g, "") : "";
  const fromEmail = fromMatch ? fromMatch[2] : from;

  // Google Groupプレフィックスを除去してオリジナル件名を取得
  const originalSubject = subject.replace(CONFIG.SUBJECT_PREFIX_REGEX, "");

  // 通報者のメールアドレスを特定（優先順位）
  // 1. Reply-To（Google Groupが元の送信者をここに設定することが多い）
  // 2. 転送メールの元送信者（本文から抽出）
  // 3. From（Google Groupアドレスの場合あり）
  const forwardedFrom = extractForwardedFrom(body);

  let reporterEmail = fromEmail;
  let reporterName = fromName;

  // Reply-Toが設定されていてGroupアドレスでない場合
  if (replyTo && !replyTo.includes(CONFIG.GROUP_EMAIL)) {
    const replyMatch = replyTo.match(/^(.+?)\s*<(.+?)>$/);
    if (replyMatch) {
      reporterEmail = replyMatch[2];
      reporterName = replyMatch[1].trim().replace(/"/g, "");
    } else if (replyTo.includes("@")) {
      reporterEmail = replyTo.trim();
    }
  }

  // FromがGroupアドレスの場合、転送元から取得を試みる
  if (fromEmail === CONFIG.GROUP_EMAIL && forwardedFrom) {
    const fwdMatch = forwardedFrom.match(/<(.+?)>/);
    if (fwdMatch) {
      reporterEmail = fwdMatch[1];
    } else if (forwardedFrom.includes("@")) {
      reporterEmail = forwardedFrom.trim();
    }
  }

  // メール本文中のURLを抽出
  const urls = extractUrls(body);

  return {
    from_email: fromEmail,
    from_name: fromName,
    subject: subject,
    original_subject: originalSubject,
    body_text: body,
    received_at: message.getDate().toISOString(),
    forwarded_from: forwardedFrom,
    reporter_email: reporterEmail,
    reporter_name: reporterName,
    urls_found: urls,
  };
}

/**
 * 転送メールから元の送信者を抽出
 */
function extractForwardedFrom(body) {
  // 日本語の転送形式
  const patterns = [
    /差出人[:：]\s*(.+?)[\r\n]/,
    /From[:：]\s*(.+?)[\r\n]/i,
    /送信者[:：]\s*(.+?)[\r\n]/,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * テキストからURLを抽出
 */
function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s<>"\]）》」』\r\n]+/gi;
  const matches = text.match(urlRegex);
  if (!matches) return [];

  // 重複除去 & 最大10件
  const unique = [...new Set(matches)];
  return unique.slice(0, 10);
}

/**
 * JCS APIに通報データを送信
 * parseEmailの結果をそのまま送信（reporter_email, original_subject含む）
 */
function sendToApi(emailData, apiSecret) {
  const payload = {
    from_email: emailData.from_email,
    from_name: emailData.from_name,
    subject: emailData.subject,
    original_subject: emailData.original_subject,
    body_text: emailData.body_text,
    received_at: emailData.received_at,
    forwarded_from: emailData.forwarded_from,
    reporter_email: emailData.reporter_email,
    reporter_name: emailData.reporter_name,
    urls_found: emailData.urls_found,
  };

  Logger.log(`📤 API送信データ: reporter_email=${payload.reporter_email}, original_subject=${payload.original_subject}`);

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": apiSecret,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(CONFIG.API_URL, options);
  const statusCode = response.getResponseCode();
  const responseText = response.getContentText();
  Logger.log(`📥 APIレスポンス: ${statusCode} ${responseText}`);

  const result = JSON.parse(responseText);

  if (statusCode === 200 && result.success) {
    return result;
  } else {
    return { success: false, error: result.error || `HTTP ${statusCode}` };
  }
}

/**
 * 通報者に自動返信を送信
 */
function sendAutoReply(originalMessage, reportId, threatType) {
  const fromEmail = originalMessage.getFrom();
  const subject = originalMessage.getSubject();

  // 脅威タイプの日本語ラベル
  const typeLabels = {
    phishing_email: "フィッシングメール",
    scam_sms: "詐欺SMS",
    fake_site: "偽サイト",
    suspicious_url: "不審なURL",
    malware: "マルウェア",
    other: "その他の脅威",
  };

  const typeName = typeLabels[threatType] || "サイバー脅威";

  const replyBody = `
ご通報いただきありがとうございます。

Japan Cyber Shield (JCS) がお客様からの通報を受け付けました。

━━━━━━━━━━━━━━━━━━━━
📋 通報受付情報
━━━━━━━━━━━━━━━━━━━━
通報ID: ${reportId}
分類: ${typeName}
ステータス: AI分析中
━━━━━━━━━━━━━━━━━━━━

現在AIによる自動分析を行っています。
分析結果は脅威データベースに反映されます。

🔗 脅威データベース: ${CONFIG.SITE_URL}/threats

━━━━━━━━━━━━━━━━━━━━
🛡️ Japan Cyber Shield
市民参加型サイバー防衛プラットフォーム
${CONFIG.SITE_URL}
━━━━━━━━━━━━━━━━━━━━

※ このメールは自動送信されています。
※ 通報内容に個人情報が含まれる場合、適切に保護されます。
`.trim();

  // 元のメールに返信
  originalMessage.reply(replyBody, {
    name: "Japan Cyber Shield",
  });
}

/**
 * 初期セットアップ: ラベル作成とトリガー設定
 * 手動で1回実行してください
 */
function setup() {
  // ラベル作成
  if (!GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL)) {
    GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
    Logger.log(`ラベル「${CONFIG.PROCESSED_LABEL}」を作成しました`);
  }
  if (!GmailApp.getUserLabelByName(CONFIG.ERROR_LABEL)) {
    GmailApp.createLabel(CONFIG.ERROR_LABEL);
    Logger.log(`ラベル「${CONFIG.ERROR_LABEL}」を作成しました`);
  }

  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "processNewEmails") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // 5分間隔のトリガーを作成
  ScriptApp.newTrigger("processNewEmails")
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log("✅ セットアップ完了！5分ごとにメールをチェックします。");
  Logger.log("⚠️ スクリプトプロパティに API_SECRET を設定してください。");
}

/**
 * テスト: 最新のメールで動作確認
 */
function testWithLatestEmail() {
  const threads = GmailApp.getInboxThreads(0, 1);
  if (threads.length === 0) {
    Logger.log("受信メールがありません");
    return;
  }

  const message = threads[0].getMessages()[0];
  const emailData = parseEmail(message);
  Logger.log("解析結果:");
  Logger.log(JSON.stringify(emailData, null, 2));
}
