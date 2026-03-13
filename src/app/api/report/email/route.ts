import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// メール通報用APIエンドポイント
// Google Apps Scriptからメールデータを受け取り、threat_reportsに保存

// 簡易APIキー認証
const API_SECRET = process.env.JCS_EMAIL_API_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // APIキー認証
    const authHeader = request.headers.get("x-api-key");
    if (!API_SECRET || authHeader !== API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();
    const body = await request.json();

    const {
      from_email,
      from_name,
      subject,
      original_subject,
      body_text,
      body_html,
      received_at,
      forwarded_from,
      reporter_email,
      reporter_name,
      urls_found,
    } = body;

    if (!from_email || !subject) {
      return NextResponse.json(
        { error: "from_email と subject は必須です" },
        { status: 400 }
      );
    }

    // メール内容から脅威タイプを推定（オリジナル件名優先）
    const effectiveSubject = original_subject || subject;
    const threatType = detectThreatType(effectiveSubject, body_text || "");

    // タイトルを整形（Google Groupプレフィックス除去済みのoriginal_subject優先）
    const rawTitle = effectiveSubject;
    const title = rawTitle.startsWith("Fwd:")
      ? rawTitle.replace(/^Fwd:\s*/, "【転送】")
      : rawTitle.startsWith("Fw:")
      ? rawTitle.replace(/^Fw:\s*/, "【転送】")
      : rawTitle;

    // 説明文を構築
    const descriptionParts = [];
    if (forwarded_from) {
      descriptionParts.push(`【元の送信者】${forwarded_from}`);
    }
    if (body_text) {
      // 本文を最大500文字に制限
      const truncated = body_text.length > 500
        ? body_text.substring(0, 500) + "..."
        : body_text;
      descriptionParts.push(`【メール本文】\n${truncated}`);
    }
    if (urls_found && urls_found.length > 0) {
      descriptionParts.push(`【検出URL】\n${urls_found.join("\n")}`);
    }
    descriptionParts.push(`\n---\nメール通報 by ${from_name || from_email}`);

    const description = descriptionParts.join("\n\n");

    // 通報者情報（Apps Scriptが特定したreporter_emailを優先）
    const effectiveReporterEmail = reporter_email || from_email;
    const effectiveReporterName = reporter_name || from_name || null;

    console.log(`[Email Report] reporter_email=${effectiveReporterEmail}, email_subject=${effectiveSubject}, from=${from_email}`);

    // Supabaseに保存
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("threat_reports")
      .insert({
        threat_type: threatType,
        title: title,
        description: description,
        url: urls_found?.[0] || null,
        email_from: forwarded_from || from_email,
        email_subject: effectiveSubject,
        reporter_name: effectiveReporterName,
        reporter_email: effectiveReporterEmail,
        severity: "medium",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "通報の保存に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      threat_type: threatType,
      message: "メール通報を受け付けました",
    });
  } catch (err) {
    console.error("Email report API error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// メール内容から脅威タイプを自動判定
function detectThreatType(subject: string, body: string): string {
  const text = (subject + " " + body).toLowerCase();

  // フィッシング関連キーワード
  if (
    text.includes("フィッシング") ||
    text.includes("phishing") ||
    text.includes("アカウント確認") ||
    text.includes("パスワード") ||
    text.includes("ログイン") ||
    text.includes("本人確認") ||
    text.includes("認証")
  ) {
    return "phishing_email";
  }

  // 詐欺SMS関連
  if (
    text.includes("sms") ||
    text.includes("ショートメッセージ") ||
    text.includes("不在通知") ||
    text.includes("宅配") ||
    text.includes("荷物")
  ) {
    return "scam_sms";
  }

  // 偽サイト関連
  if (
    text.includes("偽サイト") ||
    text.includes("fake") ||
    text.includes("なりすまし") ||
    text.includes("偽の")
  ) {
    return "fake_site";
  }

  // マルウェア関連
  if (
    text.includes("ウイルス") ||
    text.includes("マルウェア") ||
    text.includes("malware") ||
    text.includes("ランサムウェア") ||
    text.includes("添付ファイル")
  ) {
    return "malware";
  }

  // 不審URL
  if (
    text.includes("url") ||
    text.includes("リンク") ||
    text.includes("http")
  ) {
    return "suspicious_url";
  }

  // デフォルト: フィッシングメール（メール通報なので）
  return "phishing_email";
}
