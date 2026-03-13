"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  Send,
  CheckCircle,
  AlertTriangle,
  Mail,
  Smartphone,
  Link2,
  Bug,
  HelpCircle,
  Globe,
} from "lucide-react";
import type { ThreatType } from "@/lib/supabase";

const threatTypeOptions: {
  value: ThreatType;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    value: "phishing_email",
    label: "フィッシングメール",
    icon: Mail,
    desc: "銀行・サービスを装った偽メール",
  },
  {
    value: "scam_sms",
    label: "詐欺SMS",
    icon: Smartphone,
    desc: "宅配・料金未払いなどの偽SMS",
  },
  {
    value: "fake_site",
    label: "偽サイト",
    icon: Globe,
    desc: "偽のECサイト・ログインページ",
  },
  {
    value: "suspicious_url",
    label: "不審なURL",
    icon: Link2,
    desc: "怪しいリンク・リダイレクト",
  },
  {
    value: "malware",
    label: "マルウェア",
    icon: Bug,
    desc: "不審な添付ファイル・ダウンロード",
  },
  {
    value: "other",
    label: "その他",
    icon: HelpCircle,
    desc: "上記に該当しない脅威",
  },
];

export default function ReportPage() {
  const [selectedType, setSelectedType] = useState<ThreatType | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    email_from: "",
    email_subject: "",
    reporter_name: "",
    reporter_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setSubmitting(true);

    // In production, this would POST to Supabase
    // For now, simulate the submission
    await new Promise((r) => setTimeout(r, 1500));

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-20 h-20 rounded-full bg-jcs-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-jcs-green" />
            </div>
            <h1 className="text-2xl font-bold mb-3">通報を受け付けました</h1>
            <p className="text-gray-400 mb-2">
              ご協力ありがとうございます。AI分析を開始します。
            </p>
            <p className="text-sm text-gray-500 mb-8">
              分析結果は脅威データベースに反映されます。
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedType(null);
                  setForm({
                    title: "",
                    description: "",
                    url: "",
                    email_from: "",
                    email_subject: "",
                    reporter_name: "",
                    reporter_email: "",
                  });
                }}
                className="btn-primary"
              >
                別の脅威を通報
              </button>
              <a href="/threats" className="btn-secondary">
                脅威DBを見る
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              Citizen Sensor Layer
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              サイバー脅威を通報
            </h1>
            <p className="text-gray-400">
              あなたの通報が日本のサイバー防衛に貢献します
            </p>
          </div>

          {/* Step 1: Threat Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-jcs-accent/20 text-jcs-accent text-sm flex items-center justify-center font-bold">
                1
              </span>
              脅威の種類を選択
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {threatTypeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`glass-card p-4 text-left transition-all hover:border-jcs-accent/30 ${
                    selectedType === t.value
                      ? "border-jcs-accent glow-accent"
                      : ""
                  }`}
                >
                  <t.icon
                    className={`w-6 h-6 mb-2 ${
                      selectedType === t.value
                        ? "text-jcs-accent"
                        : "text-gray-500"
                    }`}
                  />
                  <div className="font-medium text-sm">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Details form */}
          {selectedType && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-jcs-accent/20 text-jcs-accent text-sm flex items-center justify-center font-bold">
                    2
                  </span>
                  詳細情報を入力
                </h2>
                <div className="glass-card p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      タイトル <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="例: Amazonを装ったフィッシングメール"
                      className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                    />
                  </div>

                  {/* URL */}
                  {(selectedType === "fake_site" ||
                    selectedType === "suspicious_url" ||
                    selectedType === "phishing_email") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        不審なURL
                      </label>
                      <input
                        value={form.url}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, url: e.target.value }))
                        }
                        placeholder="https://..."
                        className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors font-mono"
                      />
                    </div>
                  )}

                  {/* Email fields */}
                  {(selectedType === "phishing_email" ||
                    selectedType === "scam_sms") && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          送信元アドレス
                        </label>
                        <input
                          value={form.email_from}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              email_from: e.target.value,
                            }))
                          }
                          placeholder="spam@example.com"
                          className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          件名
                        </label>
                        <input
                          value={form.email_subject}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              email_subject: e.target.value,
                            }))
                          }
                          placeholder="メールの件名"
                          className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      詳細説明 <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="受け取った内容、状況、気づいた点など、できるだけ詳しく記載してください。"
                      className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Reporter info (optional) */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-jcs-accent/20 text-jcs-accent text-sm flex items-center justify-center font-bold">
                    3
                  </span>
                  通報者情報
                  <span className="text-xs text-gray-500 font-normal">
                    （任意）
                  </span>
                </h2>
                <div className="glass-card p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        お名前
                      </label>
                      <input
                        value={form.reporter_name}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            reporter_name: e.target.value,
                          }))
                        }
                        placeholder="匿名でも通報できます"
                        className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={form.reporter_email}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            reporter_email: e.target.value,
                          }))
                        }
                        placeholder="結果通知を希望する場合"
                        className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-lg py-4 px-12 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      脅威を通報する
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  通報内容はAIで自動分析され、脅威データベースに登録されます。
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
