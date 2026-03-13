// Japan Cyber Shield - Background Service Worker
const API_BASE = "https://cybershield-jp-drop-stone-ai.vercel.app";

// コンテキストメニュー作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "jcs-report-page",
    title: "🛡️ このページをJCSに通報",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "jcs-report-link",
    title: "🛡️ このリンクをJCSに通報",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "jcs-report-selection",
    title: "🛡️ 選択テキストをJCSに通報",
    contexts: ["selection"]
  });
});

// コンテキストメニュークリック処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let reportData = {};

  switch (info.menuItemId) {
    case "jcs-report-page":
      reportData = {
        threat_type: "suspicious_url",
        title: `不審なページ: ${tab.title || "不明"}`,
        description: `不審なページとして通報されました。\nURL: ${tab.url}`,
        url: tab.url,
      };
      break;

    case "jcs-report-link":
      reportData = {
        threat_type: "suspicious_url",
        title: `不審なリンク`,
        description: `不審なリンクとして通報されました。\nリンクURL: ${info.linkUrl}\nページ: ${tab.url}`,
        url: info.linkUrl,
      };
      break;

    case "jcs-report-selection":
      reportData = {
        threat_type: "other",
        title: `不審なコンテンツの通報`,
        description: `不審なテキストとして通報されました。\n\n選択テキスト:\n${info.selectionText}\n\nページURL: ${tab.url}`,
        url: tab.url,
      };
      break;
  }

  submitReport(reportData, tab.id);
});

// 通報送信
async function submitReport(data, tabId) {
  try {
    // 通報者情報を取得
    const stored = await chrome.storage.local.get(["reporter_name", "reporter_email"]);
    if (stored.reporter_name) data.reporter_name = stored.reporter_name;
    if (stored.reporter_email) data.reporter_email = stored.reporter_email;

    const response = await fetch(`${API_BASE}/api/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      // 成功通知をコンテンツスクリプトに送信
      chrome.tabs.sendMessage(tabId, {
        type: "JCS_NOTIFICATION",
        status: "success",
        message: "通報完了！ご協力ありがとうございます。",
      });

      // 通報カウントを更新
      const counts = await chrome.storage.local.get(["report_count"]);
      const newCount = (counts.report_count || 0) + 1;
      await chrome.storage.local.set({ report_count: newCount });
    } else {
      chrome.tabs.sendMessage(tabId, {
        type: "JCS_NOTIFICATION",
        status: "error",
        message: "通報に失敗しました。もう一度お試しください。",
      });
    }
  } catch (err) {
    console.error("JCS Report Error:", err);
    chrome.tabs.sendMessage(tabId, {
      type: "JCS_NOTIFICATION",
      status: "error",
      message: "ネットワークエラー。接続を確認してください。",
    });
  }
}

// ポップアップからのメッセージを処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUBMIT_REPORT") {
    submitReportFromPopup(message.data)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // 非同期レスポンスを示す
  }
});

async function submitReportFromPopup(data) {
  const response = await fetch(`${API_BASE}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}
