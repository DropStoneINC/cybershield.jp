/**
 * Japan Cyber Shield - メール通報自動処理
 *
 * cybershield.jp@dropstone.co.jp に届いたメールを自動的にJCS APIに送信し、
 * 通報者に自動返信を送る Google Apps Script
 *
 * セットアップ:
 * 1. script.google.com で新規プロジェクト作成
 * 2. このコードを貼り付け
 * 3. スクリプトプロパティに API_SECRET を設定
 * 4. processNewEmails にトリガーを設定（5分間隔）
 */

// ===== 設定 =====
const CONFIG = {
  API_URL: "https://cybershield-jp-drop-stone-ai.vercel.app/api/report/email",
  PROCESSED_LABEL: "JCS-処理済み",
  ERROR_LABEL: "JCS-エラー",
  SITE_URL: "https://cybershield-jp-drop-stone-ai.vercel.app",
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

  // 未処理の受信メールを検索（処理済みラベルがないもの）
  const query = `in:inbox -label:${CONFIG.PROCESSED_LABEL} -label:${CONFIG.ERROR_LABEL}`;
  const threads = GmailApp.search(query, 0, 20);

  if (threads.length === 0) {
    Logger.log("新しいメールはありません");
    return;
  }

  Logger.log(`${threads.length} 件の未処理メールを発見`);

  for (const thread of threads) {
    try {
      const messages = thread.getMessages();
      // スレッドの最初のメッセージを処理
      const message = messages[0];

      const emailData = parseEmail(message);
      const result = sendToApi(emailData, apiSecret);

      if (result.success) {
        // 処理済みラベルを付与
        thread.addLabel(processedLabel);

        // 自動返信を送信
        sendAutoReply(message, result.id, result.threat_type);

        Logger.log(`✅ 処理完了: ${emailData.subject} (ID: ${result.id})`);
      } else {
        thread.addLabel(errorLabel);
        Logger.log(`❌ API エラー: ${result.error}`);
      }
    } catch (e) {
      thread.addLabel(errorLabel);
      Logger.log(`❌ 処理エラー: ${e.message}`);
    }
  }
}

/**
 * メールを解析してAPI送信用データに変換
 */
function parseEmail(message) {
  const body = message.getPlainBody() || "";
  const from = message.getFrom();
  const subject = message.getSubject();

  // 送信者名とメールアドレスを分離
  const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/);
  const fromName = fromMatch ? fromMatch[1].trim().replace(/"/g, "") : "";
  const fromEmail = fromMatch ? fromMatch[2] : from;

  // 転送メールの元の送信者を抽出
  const forwardedFrom = extractForwardedFrom(body);

  // メール本文中のURLを抽出
  const urls = extractUrls(body);

  return {
    from_email: fromEmail,
    from_name: fromName,
    subject: subject,
    body_text: body,
    received_at: message.getDate().toISOString(),
    forwarded_from: forwardedFrom,
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
 */
function sendToApi(emailData, apiSecret) {
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": apiSecret,
    },
    payload: JSON.stringify(emailData),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(CONFIG.API_URL, options);
  const statusCode = response.getResponseCode();
  const result = JSON.parse(response.getContentText());

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
