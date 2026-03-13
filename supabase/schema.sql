-- Japan Cyber Shield - Database Schema
-- Run this in Supabase SQL Editor or apply as a migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Threat type enum
CREATE TYPE threat_type AS ENUM (
  'phishing_email',
  'scam_sms',
  'fake_site',
  'suspicious_url',
  'malware',
  'other'
);

-- Severity enum
CREATE TYPE threat_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Status enum
CREATE TYPE threat_status AS ENUM ('pending', 'analyzing', 'confirmed', 'false_positive');

-- Main threat reports table
CREATE TABLE threat_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Report details
  threat_type threat_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  email_from TEXT,
  email_subject TEXT,

  -- Reporter (optional)
  reporter_name TEXT,
  reporter_email TEXT,
  reporter_ip INET,

  -- Analysis
  severity threat_severity DEFAULT 'medium',
  status threat_status DEFAULT 'pending',
  ai_analysis TEXT,
  ai_confidence FLOAT,

  -- Community
  upvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Metadata
  tags TEXT[],
  raw_data JSONB
);

-- Indexes for common queries
CREATE INDEX idx_threat_reports_type ON threat_reports (threat_type);
CREATE INDEX idx_threat_reports_severity ON threat_reports (severity);
CREATE INDEX idx_threat_reports_status ON threat_reports (status);
CREATE INDEX idx_threat_reports_created ON threat_reports (created_at DESC);
CREATE INDEX idx_threat_reports_url ON threat_reports (url) WHERE url IS NOT NULL;

-- Full text search index
CREATE INDEX idx_threat_reports_search ON threat_reports
  USING GIN (to_tsvector('japanese', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON threat_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE threat_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read confirmed threats
CREATE POLICY "Public read confirmed threats"
  ON threat_reports FOR SELECT
  USING (status = 'confirmed' OR status = 'analyzing');

-- Anyone can insert reports (anonymous reporting)
CREATE POLICY "Anyone can report threats"
  ON threat_reports FOR INSERT
  WITH CHECK (true);

-- Upvote function
CREATE OR REPLACE FUNCTION upvote_threat(threat_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE threat_reports
  SET upvotes = upvotes + 1
  WHERE id = threat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
