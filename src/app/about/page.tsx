import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  Target,
  Users,
  BookOpen,
  Zap,
  Github,
  Building,
  GraduationCap,
  Globe,
  Heart,
} from "lucide-react";

const missions = [
  {
    icon: Zap,
    title: "サイバー脅威のリアルタイム共有",
    desc: "フィッシング・詐欺・マルウェアの情報を即座に全国へ配信",
  },
  {
    icon: Users,
    title: "国民参加型防御ネットワークの構築",
    desc: "一人ひとりがセンサーとなり、集合知でサイバー攻撃に対抗",
  },
  {
    icon: BookOpen,
    title: "次世代サイバー人材の育成",
    desc: "教育プログラム・CTF・OSSコミュニティで専門家を育成",
  },
];

const partners = [
  "IPA（情報処理推進機構）",
  "NISC（内閣サイバーセキュリティセンター）",
  "JPCERT/CC",
  "警察庁",
  "総務省",
  "通信キャリア",
  "IT企業",
];

const roadmap = [
  {
    phase: "Phase 1",
    period: "0〜6ヶ月",
    title: "基盤構築",
    items: ["GitHubリポジトリ公開", "通報システムMVP", "基本データベース構築"],
    active: true,
  },
  {
    phase: "Phase 2",
    period: "6〜12ヶ月",
    title: "AI分析導入",
    items: ["フィッシング自動検知", "URL・ドメイン解析", "攻撃キャンペーン検出"],
    active: false,
  },
  {
    phase: "Phase 3",
    period: "1〜2年",
    title: "全国展開",
    items: [
      "ブラウザ拡張公開",
      "API一般公開",
      "教育プログラム開始",
      "企業連携強化",
    ],
    active: false,
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 text-jcs-accent mx-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Japan Cyber Shield について
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              国民・企業・専門家が協力し、日本全体のサイバー攻撃防御力を高めるためのオープンソース型サイバー防衛プラットフォーム
            </p>
          </div>

          {/* Vision */}
          <section className="mb-16">
            <div className="glass-card glow-accent p-8 text-center">
              <Target className="w-10 h-10 text-jcs-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">ビジョン</h2>
              <p className="text-xl text-jcs-accent font-medium mb-2">
                「国民全員がサイバー防衛のセンサーになる社会」
              </p>
              <p className="text-gray-400">
                一人の通報が日本全体を守る。被害が広がる前に防ぐ。
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">ミッション</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {missions.map((m) => (
                <div key={m.title} className="glass-card p-6">
                  <m.icon className="w-8 h-8 text-jcs-accent mb-4" />
                  <h3 className="font-bold mb-2">{m.title}</h3>
                  <p className="text-sm text-gray-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open Source */}
          <section className="mb-16">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Github className="w-8 h-8 text-jcs-accent" />
                <h2 className="text-2xl font-bold">
                  完全オープンソース
                </h2>
              </div>
              <p className="text-gray-400 mb-4">
                Japan Cyber
                ShieldはGitHub上で開発される完全オープンソースプロジェクトです。世界中の開発者が参加でき、透明性・信頼性・セキュリティ監査を確保します。
              </p>
              <div className="grid sm:grid-cols-4 gap-4">
                {["透明性", "信頼性", "セキュリティ監査", "世界の開発者参加"].map(
                  (item) => (
                    <div
                      key={item}
                      className="bg-jcs-dark/50 border border-jcs-border rounded-lg p-3 text-center text-sm text-jcs-accent"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              ガバナンス
            </h2>
            <div className="glass-card p-8">
              <p className="text-gray-400 text-center mb-6">
                非営利団体{" "}
                <span className="text-white font-semibold">
                  Japan Cyber Shield Foundation
                </span>{" "}
                が運営
              </p>
              <div className="flex flex-col items-center gap-3">
                {["理事会", "技術委員会", "セキュリティ監査委員会", "コミュニティ運営"].map(
                  (item, i) => (
                    <div key={item} className="flex items-center gap-3">
                      {i > 0 && (
                        <div className="w-px h-4 bg-jcs-border -mt-7 absolute" />
                      )}
                      <div className="bg-jcs-accent/10 border border-jcs-accent/20 rounded-lg px-6 py-3 text-center">
                        <span className="text-jcs-accent font-medium">
                          {item}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              提携機関（想定）
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {partners.map((p) => (
                <div
                  key={p}
                  className="glass-card px-5 py-3 flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{p}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              開発ロードマップ
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roadmap.map((r) => (
                <div
                  key={r.phase}
                  className={`glass-card p-6 ${
                    r.active ? "border-jcs-accent glow-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-bold ${
                        r.active ? "text-jcs-accent" : "text-gray-500"
                      }`}
                    >
                      {r.phase}
                    </span>
                    {r.active && (
                      <span className="text-xs bg-jcs-accent/20 text-jcs-accent px-2 py-0.5 rounded-full">
                        現在
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{r.period}</div>
                  <h3 className="font-bold mb-3">{r.title}</h3>
                  <ul className="space-y-2">
                    {r.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-gray-400 flex items-start gap-2"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            r.active ? "bg-jcs-accent" : "bg-gray-600"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Participants */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">参加者</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "国民" },
                { icon: Building, label: "企業" },
                { icon: GraduationCap, label: "大学・研究機関" },
                { icon: Shield, label: "セキュリティ研究者" },
              ].map((p) => (
                <div key={p.label} className="glass-card p-5 text-center">
                  <p.icon className="w-8 h-8 text-jcs-accent mx-auto mb-2" />
                  <div className="text-sm font-medium">{p.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Final goal */}
          <section className="text-center">
            <div className="glass-card glow-green p-10 max-w-2xl mx-auto">
              <Globe className="w-12 h-12 text-jcs-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">最終目標</h2>
              <p className="text-lg text-jcs-green font-medium mb-2">
                世界最大のサイバー防衛OSSプロジェクト
              </p>
              <p className="text-gray-400">
                日本をサイバー防衛先進国へ導く
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
