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
    label: "ãã£ãã·ã³ã°ã¡ã¼ã«",
    icon: Mail,
    desc: "éè¡ã»ãµã¼ãã¹ãè£ã£ãå½ã¡ã¼ã«",
  },
  {
    value: "scam_sms",
    label: "è©æ¬ºSMS",
    icon: Smartphone,
    desc: "å®éã»æéæªæããªã©ã®å½SMS",
  },
  {
    value: "fake_site",
    label: "å½ãµã¤ã",
    icon: Globe,
    desc: "å½ã®ECãµã¤ãã»ã­ã°ã¤ã³ãã¼ã¸",
  },
  {
    value: "suspicious_url",
    label: "ä¸å¯©ãªURL",
    icon: Link2,
    desc: "æªãããªã³ã¯ã»ãªãã¤ã¬ã¯ã",
  },
  {
    value: "malware",
    label: "ãã«ã¦ã§ã¢",
    icon: Bug,
    desc: "ä¸å¯©ãªæ·»ä»ãã¡ã¤ã«ã»ãã¦ã³ã­ã¼ã",
  },
  {
    value: "other",
    label: "ãã®ä»",
    icon: HelpCircle,
    desc: "ä¸è¨ã«è©²å½ããªãèå¨",
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

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threat_type: selectedType,
          ...form,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "送信に失敗しました");
      }

      setSubmitted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "送信中にエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold mb-3">éå ±ãåãä»ãã¾ãã</h1>
            <p className="text-gray-400 mb-2">
              ãååãããã¨ããããã¾ããAIåæãéå§ãã¾ãã
            </p>
            <p className="text-sm text-gray-500 mb-8">
              åæçµæã¯èå¨ãã¼ã¿ãã¼ã¹ã«åæ ããã¾ãã
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
                å¥ã®èå¨ãéå ±
              </button>
              <a href="/threats" className="btn-secondary">
                èå¨DBãè¦ã
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
              ãµã¤ãã¼èå¨ãéå ±
            </h1>
            <p className="text-gray-400">
              ããªãã®éå ±ãæ¥æ¬ã®ãµã¤ãã¼é²è¡ã«è²¢ç®ãã¾ã
            </p>
          </div>

          {/* Step 1: Threat Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-jcs-accent/20 text-jcs-accent text-sm flex items-center justify-center font-bold">
                1
              </span>
              èå¨ã®ç¨®é¡ãé¸æ
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
                  è©³ç´°æå ±ãå¥å
                </h2>
                <div className="glass-card p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      ã¿ã¤ãã« <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="ä¾: Amazonãè£ã£ããã£ãã·ã³ã°ã¡ã¼ã«"
                      className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                    />
                  </div>

                  {/* URL */}
                  {(selectedType === "fake_site" ||
                    selectedType === "suspicious_url" ||
                    selectedType === "phishing_email") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        ä¸å¯©ãªURL
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
                          éä¿¡åã¢ãã¬ã¹
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
                          ä»¶å
                        </label>
                        <input
                          value={form.email_subject}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              email_subject: e.target.value,
                            }))
                          }
                          placeholder="ã¡ã¼ã«ã®ä»¶å"
                          className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      è©³ç´°èª¬æ <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="åãåã£ãåå®¹ãç¶æ³ãæ°ã¥ããç¹ãªã©ãã§ããã ãè©³ããè¨è¼ãã¦ãã ããã"
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
                  éå ±èæå ±
                  <span className="text-xs text-gray-500 font-normal">
                    ï¼ä»»æï¼
                  </span>
                </h2>
                <div className="glass-card p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        ãåå
                      </label>
                      <input
                        value={form.reporter_name}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            reporter_name: e.target.value,
                          }))
                        }
                        placeholder="å¿åã§ãéå ±ã§ãã¾ã"
                        className="w-full bg-jcs-dark border border-jcs-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        ã¡ã¼ã«ã¢ãã¬ã¹
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
                        placeholder="çµæéç¥ãå¸æããå ´å"
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
                      éä¿¡ä¸­...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      èå¨ãéå ±ãã
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  éå ±åå®¹ã¯AIã§èªååæãããèå¨ãã¼ã¿ãã¼ã¹ã«ç»é²ããã¾ãã
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
