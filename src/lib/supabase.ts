import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type ThreatType =
  | "phishing_email"
  | "scam_sms"
  | "fake_site"
  | "suspicious_url"
  | "malware"
  | "other";

export type ThreatSeverity = "low" | "medium" | "high" | "critical";

export type ThreatStatus = "pending" | "analyzing" | "confirmed" | "false_positive";

export interface ThreatReport {
  id: string;
  created_at: string;
  threat_type: ThreatType;
  title: string;
  description: string;
  url?: string;
  email_from?: string;
  email_subject?: string;
  reporter_name?: string;
  reporter_email?: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  ai_analysis?: string;
  upvotes: number;
}
