import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  Zap,
  Globe,
  ArrowRight,
  Mail,
  Smartphone,
  Link2,
  Bug,
  TrendingUp,
  BookOpen,
} from "lucide-react";

const stats = [
  { value: "100万+", label: "年間フィッシング報告件数", icon: AlertTriangle },
  { value: "24h", label: "リアルタイム分析", icon: Zap },
  { value: "全国", label: "防御情報配信", icon: Globe },
];

const threatTypes = [
  { icon: Mail, label: "フィッシングメール", color: "text-red-400" },
  { icon: Smartphone, label: "詐欺SMS", color: "text-orange-400" },
  { icon: Link2, label: "偽サイト・不審URL", color: "text-yellow-400" },
  { icon: Bug, label: "マルウェア", color: "text-purple-400" },
];

const layers = [
  {
    num: "01",
    title: "通報レイヤー",
    subtitle: "Citizen Sensor Layer",
    desc: "国民が怪しいメールやサイトを投稿。メール転送、スクリーンショット、ブラウザ拡張、アプリから簡単に通報。",
    icon: Users,
  },
  {
    num: "02",
    title: "AI分析レイヤー",
    subtitle: "AI Analysis Engine",
    desc: "AIが詐欺パターン・URL・ドメイン・IPを解析し、攻撃キャンペーンを自動検出。",
    icon: Eye,
  },
  {
    num: "03",
    title: "脅威データベース",
    subtitle: "Threat Intelligence DB",
    desc: "危険ドメイン、詐欺URL、攻撃メールパターン、マルウェア情報を蓄積。",
    icon: Shield,
  },
  {
    num: "04",
    title: "防御配信レイヤー",
    subtitle: "Defense Distribution",
    desc: "個人向けアプリ通知・LINE通知、企業向けAPI・セキュリティツール連携で全国に防御情報を配信。",
    icon: Zap,
  },
  {
    num: "05",
    title: "教育・コミュニティ",
    subtitle: "Education & Community",
    desc: "セキュリティ講座、CTF、学生ハッカー育成、OSS開発コミュニティで次世代人材を育成。",
    icon: BookOpen,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-jcs-blue/20 to-transparent" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-jcs-accent/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jcs-accent/10 border border-jcs-accent/20 text-jcs-accent text-sm mb-8">
              <Shield className="w-4 h-4" />
              国民参加型サイバー防衛プラットフォーム
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Japan Cyber Shield</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
              一人の通報が、日本全体を守る。
            </p>
            <p className="text-base text-gray-500 max-w-xl mx-auto mb-10">
              フィッシング・詐欺・マルウェアの脅威情報をリアルタイム共有し、
              被害が広がる前に防ぐ。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/report" className="btn-primary text-lg py-4 px-8 inline-flex items-center gap-2">
                脅威を通報する <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/threats" className="btn-secondary text-lg py-4 px-8">
                脅威データベースを見る
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-jcs-border bg-jcs-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="w-8 h-8 text-jcs-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {s.value}
                  </div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ビジョン
              </h2>
              <p className="text-xl text-jcs-accent font-medium">
                「国民全員がサイバー防衛のセンサーになる社会」
              </p>
            </div>
            <div className="glass-card glow-accent p-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                {[
                  "一人が詐欺メールを受け取る",
                  "システムに通報",
                  "AIが即時分析",
                  "日本中に警告を配信",
                  "被害が広がる前に防ぐ",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-jcs-accent/20 text-jcs-accent flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-gray-200">{step}</div>
                    {i < 4 && (
                      <ArrowRight className="w-4 h-4 text-gray-600 ml-auto hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Threat Types */}
        <section className="py-16 bg-jcs-card/30 border-y border-jcs-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-10">
              通報できる脅威
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {threatTypes.map((t) => (
                <div
                  key={t.label}
                  className="glass-card p-6 text-center hover:border-jcs-accent/30 transition-colors"
                >
                  <t.icon className={`w-10 h-10 mx-auto mb-3 ${t.color}`} />
                  <div className="font-medium">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Layers */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              プラットフォーム構造
            </h2>
            <p className="text-gray-400 text-center mb-12">
              5層構造で国民からの通報を防御情報に変換
            </p>
            <div className="space-y-6">
              {layers.map((l) => (
                <div
                  key={l.num}
                  className="glass-card p-6 flex items-start gap-6 hover:border-jcs-accent/30 transition-colors"
                >
                  <div className="text-3xl font-black text-jcs-accent/30 shrink-0">
                    {l.num}
                  </div>
                  <l.icon className="w-8 h-8 text-jcs-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {l.title}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        {l.subtitle}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-jcs-blue/20 to-transparent">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <TrendingUp className="w-12 h-12 text-jcs-green mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              日本を世界で最も安全なサイバー国家に
            </h2>
            <p className="text-gray-400 mb-8">
              あなたの通報が、誰かの被害を防ぎます。今すぐ参加してください。
            </p>
            <Link
              href="/report"
              className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2"
            >
              脅威を通報する <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
