import { Shield, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-jcs-border bg-jcs-navy/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-jcs-accent" />
              <span className="text-lg font-bold gradient-text">
                Japan Cyber Shield
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              国民・企業・専門家が協力し、日本全体のサイバー攻撃防御力を高めるためのオープンソース型サイバー防衛プラットフォーム
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-3">
              プラットフォーム
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/report" className="hover:text-jcs-accent transition-colors">
                  脅威を通報
                </Link>
              </li>
              <li>
                <Link href="/threats" className="hover:text-jcs-accent transition-colors">
                  脅威データベース
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-jcs-accent transition-colors">
                  JCSについて
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-3">
              リンク
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-jcs-accent transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://cybershield.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-jcs-accent transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> cybershield.jp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-jcs-border text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Japan Cyber Shield Foundation. Open
          Source Project.
        </div>
      </div>
    </footer>
  );
}
