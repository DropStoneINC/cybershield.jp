"use client";

import { useState, useEffect } from "react";
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
    title: "Amazonã¢ã«ã¦ã³ãåæ­¢ãè£ã£ããã£ãã·ã³ã°ã¡ã¼ã«",
    description:
      "Amazonã«ã¹ã¿ãã¼ãµã¼ãã¹ãåä¹ããã¢ã«ã¦ã³ããåæ­¢ãããã¨å½ãããªã³ã¯åã§åäººæå ±ãå¥åãããæå£ã",
    url: "https://amaz0n-security.example.com/verify",
    email_from: "service@amaz0n-alert.com",
    email_subject: "ãç·æ¥ããå®¢æ§ã®ã¢ã«ã¦ã³ããåæ­¢ããã¾ãã",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "æ¢ç¥ã®ãã£ãã·ã³ã°ãã¿ã¼ã³ããã¡ã¤ã³ã¯Amazonã®æ­£è¦ãã¡ã¤ã³ã§ã¯ãªããé¡ä¼¼æ»æãéå»24æéã§50ä»¶ä»¥ä¸å ±åã",
    upvotes: 47,
  },
  {
    id: "2",
    created_at: "2026-03-13T09:15:00Z",
    threat_type: "scam_sms",
    title: "å®éä¸å¨éç¥ãè£ã£ãè©æ¬ºSMS",
    description:
      "ã¤ããéè¼¸ãåä¹ããä¸å¨ã®ããè·ç©ãæã¡å¸°ã£ãã¨ããSMSããªã³ã¯åã§ã¯ã¬ã¸ããã«ã¼ãæå ±ãæ±ããã",
    url: "https://yamato-delivery.example.net/track",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "è©æ¬ºSMSã®å¸åãã¿ã¼ã³ãç­ç¸®URLã¯å½ã®ãã©ãã­ã³ã°ãã¼ã¸ã«èªå°ã",
    upvotes: 32,
  },
  {
    id: "3",
    created_at: "2026-03-13T08:00:00Z",
    threat_type: "fake_site",
    title: "å½ã®Apple IDã­ã°ã¤ã³ãã¼ã¸",
    description:
      "Appleå¬å¼ãµã¤ãã«é·ä¼¼ããå½ã®ã­ã°ã¤ã³ãã¼ã¸ãApple IDã¨ãã¹ã¯ã¼ããçªåããã",
    url: "https://apple-id-verify.example.org",
    severity: "critical",
    status: "confirmed",
    ai_analysis:
      "SSLè¨¼ææ¸ãèªå·±ç½²åãWHOISã¯å¿åç»é²ããã¼ã¸æ§é ã¯Appleå¬å¼ãæ¨¡å£ã",
    upvotes: 89,
  },
  {
    id: "4",
    created_at: "2026-03-12T22:00:00Z",
    threat_type: "malware",
    title: "è«æ±æ¸ãè£ã£ããã«ã¦ã§ã¢æ·»ä»ã¡ã¼ã«",
    description:
      "åå¼åãè£ããExcelãã¡ã¤ã«ãæ·»ä»ããã¯ã­å®è¡ã§ã©ã³ãµã ã¦ã§ã¢ããã¦ã³ã­ã¼ãã",
    email_from: "billing@fake-company.example.jp",
    email_subject: "2æåº¦è«æ±æ¸éä»ã®ä»¶",
    severity: "critical",
    status: "analyzing",
    ai_analysis: "æ·»ä»ãã¡ã¤ã«ã«VBAãã¯ã­æ¤åºãC2ãµã¼ãã¼ã¸ã®éä¿¡ãç¢ºèªã",
    upvotes: 15,
  },
  {
    id: "5",
    created_at: "2026-03-12T18:30:00Z",
    threat_type: "suspicious_url",
    title: "SNSä¸ã®ä¸å¯©ãªç­ç¸®URL",
    description:
      "Twitter/Xã§æ¡æ£ä¸­ã®ç­ç¸®URLãã¯ãªãã¯ããã¨è¤æ°ã®ãªãã¤ã¬ã¯ããçµã¦ä¸å¯©ãªãã¼ã¸ã«é·ç§»ã",
    url: "https://bit.ly/example123",
    severity: "medium",
    status: "pending",
    upvotes: 8,
  },
  {
    id: "6",
    created_at: "2026-03-12T15:00:00Z",
    threat_type: "phishing_email",
    title: "ä¸äºä½åéè¡ãè£ã£ãèªè¨¼ã¡ã¼ã«",
    description:
      "å£åº§ã®æ¬äººç¢ºèªãå¿è¦ã¨ãã¦ãå½ã®ã­ã°ã¤ã³ãã¼ã¸ã«èªå°ããã¡ã¼ã«ã",
    url: "https://smbc-auth.example.com",
    email_from: "info@smbc-notice.example.com",
    email_subject: "ãéè¦ãæ¬äººç¢ºèªã®ãé¡ã",
    severity: "high",
    status: "confirmed",
    ai_analysis:
      "éè¡ãã£ãã·ã³ã°ã®å¸åãã¿ã¼ã³ãæ­£è¦ãã¡ã¤ã³ã¨ã®ä¸æå­éãã",
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
  phishing_email: "ãã£ãã·ã³ã°ã¡ã¼ã«",
  scam_sms: "è©æ¬ºSMS",
  fake_site: "å½ãµã¤ã",
  suspicious_url: "ä¸å¯©URL",
  malware: "ãã«ã¦ã§ã¢",
  other: "ãã®ä»",
};

const severityColors: Record<ThreatSeverity, string> = {
  low: "bg-blue-500/20 text-blue-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const severityLabels: Record<ThreatSeverity, string> = {
  low: "ä½",
  medium: "ä¸­",
  high: "é«",
  critical: "å±éº",
};

const statusIcons: Record<ThreatStatus, React.ElementType> = {
  pending: Clock,
  analyzing: Eye,
  confirmed: CheckCircle,
  false_positive: AlertTriangle,
};

const statusLabels: Record<ThreatStatus, string> = {
  pending: "å¯©æ»å¾ã¡",
  analyzing: "åæä¸­",
  confirmed: "ç¢ºèªæ¸ã¿",
  false_positive: "èª¤å ±",
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
  const [threats, setThreats] = useState<ThreatReport[]>(demoThreats);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const res = await fetch("/api/report");
        const data = await res.json();
        if (data.threats && data.threats.length > 0) {
          // APIãã¼ã¿ã¨ãã¢ãã¼ã¿ãçµåï¼APIãã¼ã¿ãåã«è¡¨ç¤ºï¼
          setThreats([...data.threats, ...demoThreats]);
        }
      } catch (err) {
        console.error("Failed to fetch threats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchThreats();
  }, []);

  const handleUpvote = async (e: React.MouseEvent, threatId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (votingId) return;
    setVotingId(threatId);
    try {
      const res = await fetch("/api/report/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: threatId }),
      });
      const data = await res.json();
      if (data.success) {
        setThreats((prev) =>
          prev.map((t) =>
            t.id === threatId ? { ...t, upvotes: data.upvotes } : t
          )
        );
      }
    } catch (err) {
      console.error("Upvote failed:", err);
    } finally {
      setVotingId(null);
    }
  };

  const filtered = threats.filter((t) => {
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
              èå¨ãã¼ã¿ãã¼ã¹
            </h1>
            <p className="text-gray-400">
              å½æ°ããéå ±ãããèå¨æå ±ããªã¢ã«ã¿ã¤ã ã§å±æ
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "ç·éå ±æ°", value: threats.length, color: "text-jcs-accent" },
              {
                label: "ç¢ºèªæ¸ã¿",
                value: threats.filter((t) => t.status === "confirmed").length,
                color: "text-jcs-green",
              },
              {
                label: "åæä¸­",
                value: threats.filter((t) => t.status === "analyzing" || t.status === "pending").length,
                color: "text-yellow-400",
              },
              {
                label: "å±éºåº¦:é«",
                value: threats.filter(
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
                placeholder="èå¨ãæ¤ç´¢..."
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
                <option value="all">ãã¹ã¦ã®ç¨®é¡</option>
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
                          <button
                            type="button"
                            onClick={(e) => handleUpvote(e, threat.id)}
                            disabled={votingId === threat.id}
                            className={`flex items-center gap-1 hover:text-jcs-accent transition-colors cursor-pointer ${votingId === threat.id ? "opacity-50" : ""}`}
                          >
                            <ThumbsUp className="w-3 h-3" /> {threat.upvotes || 0}
                          </button>
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
                          <span className="text-gray-500">éä¿¡å:</span>
                          <code className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded text-xs">
                            {threat.email_from}
                          </code>
                        </div>
                      )}
                      {threat.ai_analysis && (
                        <div className="bg-jcs-accent/5 border border-jcs-accent/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-jcs-accent text-sm font-medium mb-2">
                            <Eye className="w-4 h-4" />
                            AIåæçµæ
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
                <p>è©²å½ããèå¨ãè¦ã¤ããã¾ãã</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
