// Japan Cyber Shield - Content Script
// ページ内通知トーストを表示

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "JCS_NOTIFICATION") {
    showNotification(message.status, message.message);
  }
});

function showNotification(status, message) {
  // 既存の通知を削除
  const existing = document.getElementById("jcs-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "jcs-notification";

  const isSuccess = status === "success";
  const bgColor = isSuccess ? "#10b981" : "#ef4444";
  const icon = isSuccess ? "✅" : "❌";

  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      background: ${bgColor};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      animation: jcs-slide-in 0.3s ease-out;
      max-width: 400px;
    ">
      <span style="font-size: 20px;">${icon}</span>
      <div>
        <div style="font-weight: 700; margin-bottom: 2px;">🛡️ Japan Cyber Shield</div>
        <div>${message}</div>
      </div>
    </div>
  `;

  // アニメーションCSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes jcs-slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes jcs-slide-out {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(toast);

  // 4秒後に消える
  setTimeout(() => {
    const el = toast.querySelector("div");
    if (el) {
      el.style.animation = "jcs-slide-out 0.3s ease-in forwards";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}
