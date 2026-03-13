import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const {
      threat_type,
      title,
      description,
      url,
      email_from,
      email_subject,
      reporter_name,
      reporter_email,
    } = body;

    // Validation
    if (!threat_type || !title || !description) {
      return NextResponse.json(
        { error: "threat_type, title, description は必須です" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("threat_reports")
      .insert({
        threat_type,
        title,
        description,
        url: url || null,
        email_from: email_from || null,
        email_subject: email_subject || null,
        reporter_name: reporter_name || null,
        reporter_email: reporter_email || null,
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
      message: "通報を受け付けました。AI分析を開始します。",
    });
  } catch (err) {
    console.error("Report API error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("threat_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ threats: data });
  } catch (err) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
