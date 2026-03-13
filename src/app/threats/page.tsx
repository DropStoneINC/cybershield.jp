"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ThumbsUp,
  ExternalLink,
  Filter,
  Mail,
  Smartphone,
  Link2,
  Bug,
  Globe,
} from "lucide-react";
import type { ThreatReport, ThreatType, ThreatSeverity, ThreatStatus } from "@/lib/supabase";

// Demo data
const demoThreats: ThreatReport[] = [
  {
    id: "1",
    created_at: "2026-03-13T10:30:00Z",
    threat_type: "phishing_email",
    title: "Amazonアカウント停止を装ったフィッシングメール",
    description:
      "Amazonカスタマーサービスを名乗り、アカウントが停止されたと偽る。リンク先で個人情報を入力させる手口。",
    url: "https://amaz0n-security.example.com/verify",
    email_from: "service@amaz0n-alert.com",
    email_subject: "【緊急】お客様のアカウントが停止されました",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "既知のフィッシングパターン。ドメインはAmazonの正規ドメインではない。類似攻撃が過去24時間で50件以上報告。",
    upvotes: 47,
  },
  {
    id: "2",
    created_at: "2026-03-13T09:15:00Z",
    threat_type: "scam_sms",
    title: "宅配不在通知を装った詐欺SMS",
    description:
      "ヤマト運輸を名乗り、不在のため荷物を持ち帰ったとするSMS。リンク先でクレジットカード情報を求める。",
    url: "https://yamato-delivery.example.net/track",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "詐欺SMSの典型パターン。短縮URLは偽のトラッキングページに誘導。",
    upvotes: 32,
  },
  {
    id: "3",
    created_at: "2026-03-13T08:00:00Z",
    threat_type: "fake_site",
    title: "偽のApple IDログインページ",
    description:
      "Apple公式サイトに酷似した偽のログインページ。Apple IDとパスワードを窃取する。",
    url: "https://apple-id-verify.example.org",
    severity: "critical",
    status: "confirmed",
    ai_analysis:
      "SSL証明書が自己署名。WHOISは匿名登録。ページ構造はApple公式を模倣。",
    upvotes: 89,
  },
  {
    id: "4",
    created_at: "2026-03-12T22:00:00Z",
    threat_type: "malware",
    title: "請求書を装ったマルウェア添付メール",
    description:
      "取引先を装い、Excelファイルを添付。マクロ実行でランサムウェアをダウンロード。",
    email_from: "billing@fake-company.example.jp",
    email_subject: "2月度請求書送付の件",
    severity: "critical",
    status: "analyzing",
    ai_analysis: "添付ファイルにVBAマクロ検出。C2サーバーへの通信を確認。",
    upvotes: 15,
  },
  {
    id: "5",
    created_at: "2026-03-12T18:30:00Z",
    threat_type: "suspicious_url",
    title: "SNS上の不審な短縮URL",
    description:
      "Twitter/Xで拡散中の短縮URL。クリックすると複数のリダイレクトを経て不審なページに遷移。",
    url: "https://bit.ly/example123",
    severity: "medium",
    status: "pending",
    upvotes: 8,
  },
  {
    id: "6",
    created_at: "2026-03-12T15:00:00Z",
    threat_type: "phishing_email",
    title: "三井住友銀行を装った認証メール",
    description:
      "口座の本人確認が必要として、偽のログインページに誘導するメール。",
    url: "https://smbc-auth.example.com",
    email_from: "info@smbc-notice.example.com",
    email_subject: "【重要】本人確認のお願い",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "銀行フィッシングの典型パターン。正規ドメインとの一文字違い。",
    upvotes: 61,
  },
];

const typeIcons: Record<ThreatType, React.ElementType> = {
  phishing_email: Mail,
  scam_sms: Smartphone,
  fake_site: Globe,
  suspicious_url: Link2,
  malware: Bug,
  other: AlertTriangle,
};

const typeLabels: Record<ThreatType, string> = {
  phishing_email: "フィッシングメール",
  scam_sms: "詐欺SMS",
  fake_site: "偽サイト",
  suspicious_url: "不審URL",
  malware: "マルウェア",
  other: "その他",
};

const severityColors: Record<ThreatSeverity, string> = {
  low: "bg-blue-500/20 text-blue-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const severityLabels: Record<ThreatSeverity, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "危険",
};

const statusIcons: Record<ThreatStatus, React.ElementType> = {
  pending: Clock,
  analyzing: Eye,
  confirmed: CheckCircle,
  false_positive: AlertTriangle,
};

const statusLabels: Record<ThreatStatus, string> = {
  pending: "審査待ち",
  analyzing: "分析中",
  confirmed: "確認済み",
  false_positive: "誤報",
};

const statusColors: Record<ThreatStatus, string> = {
  pending: "text-gray-400",
  analyzing: "text-yellow-400",
  confirmed: "text-jcs-green",
  false_positive: "text-gray-500",
};

export default function ThreatsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ThreatType | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = demoThreats.filter((t) => {
    if (typeFilter !== "all" && t.threat_type !== typeFilter) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jcs-accent/10 border border-jcs-accent/20 text-jcs-accent text-sm mb-4">
              <Shield className="w-4 h-4" />
              Threat Intelligence Database
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              脅威データベース
            </h1>
            <p className="text-gray-400">
              国民から通報された脅威情報をリアルタイムで共有
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "総通報数", value: demoThreats.length, color: "text-jcs-accent" },
              {
                label: "確認済み",
                value: demoThreats.filter((t) => t.status === "confirmed").length,
                color: "text-jcs-green",
              },
              {
                label: "分析中",
                value: demoThreats.filter((t) => t.status === "analyzing").length,
                color: "text-yellow-400",
              },
              {
                label: "危険度:高",
                value: demoThreats.filter(
                  (t) => t.severity === "critical" || t.severity === "high"
                ).length,
                color: "text-red-400",
              },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="脅威を検索..."
                className="w-full bg-jcs-card border border-jcs-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as ThreatType | "all")
                }
                className="bg-jcs-card border border-jcs-border rounded-lg pl-10 pr-8 py-3 text-sm focus:outline-none focus:border-jcs-accent transition-colors appearance-none cursor-pointer"
              >
                <option value="all">すべての種類</option>
                {Object.entries(typeLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Threat list */}
          <div className="space-y-3">
            {filtered.map((threat) => {
              const TypeIcon = typeIcons[threat.threat_type];
              const StatusIcon = statusIcons[threat.status];
              const isExpanded = expanded === threat.id;

              return (
                <div
                  key={threat.id}
                  className={`glass-card overflow-hidden transition-all ${
                    isExpanded ? "glow-accent" : ""
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpanded(isExpanded ? null : threat.id)
                    }
                    className="w-full p-5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <TypeIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              severityColors[threat.severity]
                            }`}
                          >
                            {severityLabels[threat.severity]}
                          </span>
                          <span
                            className={`text-xs flex items-center gap-1 ${
                              statusColors[threat.status]
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusLabels[threat.status]}
                          </span>
                          <span className="text-xs text-gray-600">
                            {typeLabels[threat.threat_type]}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm sm:text-base truncate">
                          {threat.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {new Date(threat.created_at).toLocaleDateString(
                              "ja-JP"
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> {threat.upvotes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-jcs-border pt-4 space-y-4">
                      <p className="text-sm text-gray-300">
                        {threat.description}
                      </p>
                      {threat.url && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">URL:</span>
                          <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs break-all">
                            {threat.url}
                          </code>
                        </div>
                      )}
                      {threat.email_from && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">送信元:</span>
                          <code className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded text-xs">
                            {threat.email_from}
                          </code>
                        </div>
                      )}
                      {threat.ai_analysis && (
                        <div className="bg-jcs-accent/5 border border-jcs-accent/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-jcs-accent text-sm font-medium mb-2">
                            <Eye className="w-4 h-4" />
                            AI分析結果
                          </div>
                          <p className="text-sm text-gray-300">
                            {threat.ai_analysis}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>該当する脅威が見つかりません</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
