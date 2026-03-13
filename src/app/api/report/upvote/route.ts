import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    // Use raw SQL via rpc or increment upvotes
    const { data: current, error: fetchError } = await (supabase as any)
      .from("threat_reports")
      .select("upvotes")
      .eq("id", id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const newUpvotes = (current.upvotes || 0) + 1;

    const { data, error } = await (supabase as any)
      .from("threat_reports")
      .update({ upvotes: newUpvotes })
      .eq("id", id)
      .select("id, upvotes")
      .single();

    if (error) {
      console.error("Upvote error:", error);
      return NextResponse.json(
        { error: "Failed to upvote" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, upvotes: data.upvotes });
  } catch (err) {
    console.error("Upvote API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
