// Japan Cyber Shield - Popup Script
document.addEventListener("DOMContentLoaded", init);

let selectedType = null;

function init() {
  // 通報カウント表示
  chrome.storage.local.get(["report_count", "reporter_name", "reporter_email"], (data) => {
    const count = data.report_count || 0;
    document.getElementById("report-count").textContent = `${count}件の通報`;

    // 保存済み通報者情報を復元
    if (data.reporter_name) {
      document.getElementById("reporter_name").value = data.reporter_name;
    }
    if (data.reporter_email) {
      document.getElementById("reporter_email").value = data.reporter_email;
    }
  });

  // 現在のタブURLを取得
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url) {
      document.getElementById("url").value = tabs[0].url;
    }
  });

  // 脅威タイプボタン
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedType = btn.dataset.type;
      showStep("step-detail");

      // タイプに応じたラベルとプレースホルダー
      const labels = {
        phishing_email: "フィッシングメールの詳細",
        scam_sms: "詐欺SMSの詳細",
        fake_site: "偽サイトの詳細",
        suspicious_url: "不審なURLの詳細",
        malware: "マルウェアの詳細",
        other: "脅威の詳細",
      };
      document.getElementById("detail-label").textContent = labels[selectedType] || "詳細を入力";

      // タイプに応じたタイトルプレースホルダー
      const placeholders = {
        phishing_email: "例: Amazonを装った不審なメール",
        scam_sms: "例: 宅配便の不在通知を装った詐欺SMS",
        fake_site: "例: 銀行の偽ログインページ",
        suspicious_url: "例: 短縮URLで送られてきた不審なリンク",
        malware: "例: ダウンロードしたファイルがウイルスだった",
        other: "例: SNSでの不審なDM",
      };
      document.getElementById("title").placeholder = placeholders[selectedType] || "";
      document.getElementById("title").focus();
    });
  });

  // 戻るボタン
  document.getElementById("back-btn").addEventListener("click", () => {
    showStep("step-type");
  });

  // オプションフィールドトグル
  document.getElementById("toggle-optional").addEventListener("click", () => {
    const fields = document.getElementById("optional-fields");
    const btn = document.getElementById("toggle-optional");
    if (fields.classList.contains("optional-hidden")) {
      fields.classList.remove("optional-hidden");
      fields.classList.add("optional-visible");
      btn.textContent = "▼ 通報者情報（任意）";
    } else {
      fields.classList.remove("optional-visible");
      fields.classList.add("optional-hidden");
      btn.textContent = "▶ 通報者情報（任意）";
    }
  });

  // 送信ボタン
  document.getElementById("submit-btn").addEventListener("click", submitReport);

  // もう一件通報
  document.getElementById("report-another").addEventListener("click", () => {
    selectedType = null;
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    showStep("step-type");
  });

  // リトライ
  document.getElementById("retry-btn").addEventListener("click", () => {
    showStep("step-detail");
  });
}

function showStep(stepId) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  document.getElementById(stepId).classList.add("active");
}

async function submitReport() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const url = document.getElementById("url").value.trim();
  const reporter_name = document.getElementById("reporter_name").value.trim();
  const reporter_email = document.getElementById("reporter_email").value.trim();

  // バリデーション
  if (!title) {
    shakeElement(document.getElementById("title"));
    document.getElementById("title").focus();
    return;
  }
  if (!description) {
    shakeElement(document.getElementById("description"));
    document.getElementById("description").focus();
    return;
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.textContent = "送信中...";

  // 通報者情報を保存
  if (reporter_name || reporter_email) {
    chrome.storage.local.set({
      reporter_name: reporter_name,
      reporter_email: reporter_email,
    });
  }

  const data = {
    threat_type: selectedType,
    title,
    description,
    url: url || undefined,
    reporter_name: reporter_name || undefined,
    reporter_email: reporter_email || undefined,
  };

  try {
    const result = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "SUBMIT_REPORT", data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });

    if (result && result.success) {
      // 通報カウント更新
      const counts = await chrome.storage.local.get(["report_count"]);
      const newCount = (counts.report_count || 0) + 1;
      await chrome.storage.local.set({ report_count: newCount });

      document.getElementById("done-stats").textContent =
        `あなたの累計通報数: ${newCount}件`;
      showStep("step-done");
    } else {
      document.getElementById("error-message").textContent =
        result?.error || "通報の送信に失敗しました。";
      showStep("step-error");
    }
  } catch (err) {
    document.getElementById("error-message").textContent =
      "ネットワークエラー。インターネット接続を確認してください。";
    showStep("step-error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.textContent = "🛡️ 通報する";
  }
}

function shakeElement(el) {
  el.style.borderColor = "#ef4444";
  el.style.animation = "none";
  el.offsetHeight; // reflow
  el.style.animation = "shake 0.3s ease";
  setTimeout(() => {
    el.style.borderColor = "";
    el.style.animation = "";
  }, 1000);

  // シェイクアニメーションを追加
  if (!document.getElementById("jcs-shake-style")) {
    const style = document.createElement("style");
    style.id = "jcs-shake-style";
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
}
