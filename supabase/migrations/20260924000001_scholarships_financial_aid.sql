-- NAVORA — Scholarships & Financial Aid Extension
-- Extends existing College discovery without duplicating institutions/courses
-- Implements spec §§2,3,15,16,24

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Expand scholarships master to full spec (§2)
-- Existing table has: id, institution_id NOT NULL, scholarship_name, eligibility, benefit, application_process, source_url, academic_year, verified_date, created_at
-- We keep those columns, add all missing fields idempotently

-- Make institution_id nullable (not every scholarship is institutional)
ALTER TABLE scholarships ALTER COLUMN institution_id DROP NOT NULL;

-- Core identity
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS name VARCHAR(300);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS provider_type VARCHAR(100); -- Central Government / State Government / University / Private / Foundation / NGO / Corporate CSR
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scholarship_type VARCHAR(100); -- Merit / Need-based / Merit-cum-means / Sports / Research / STEM / etc
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS funding_type VARCHAR(100); -- Fully Funded / Partial / Tuition Waiver / Stipend / Other

-- Eligibility arrays / scalars
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS education_levels TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_courses TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_streams TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_degrees TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_fields TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_nationalities TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligible_states TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS domicile_requirement TEXT;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS minimum_percentage NUMERIC(5,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS minimum_cgpa NUMERIC(4,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS income_limit NUMERIC(12,2);

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS gender_requirement VARCHAR(50);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS category_requirement TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS disability_requirement VARCHAR(100);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_requirement TEXT;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS academic_requirements TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- Benefits
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS award_amount NUMERIC(12,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS award_currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS tuition_coverage TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS living_allowance TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS travel_allowance TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS accommodation TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS insurance TEXT;

-- Dates
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_start_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS academic_year_new VARCHAR(50) DEFAULT '2026-27';

-- Source / verification (§15, §16)
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS official_application_url VARCHAR(500);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS official_source_url VARCHAR(500);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS source_name VARCHAR(255);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS source_type VARCHAR(100);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'NEEDS_VERIFICATION';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS next_verification_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';

-- Backfill name from scholarship_name
UPDATE scholarships SET name = scholarship_name WHERE name IS NULL AND scholarship_name IS NOT NULL;
UPDATE scholarships SET description = benefit WHERE description IS NULL;
UPDATE scholarships SET official_source_url = source_url WHERE official_source_url IS NULL;
UPDATE scholarships SET verification_status = 'VERIFIED' WHERE verification_status IS NULL AND verified_date IS NOT NULL;

-- Constraints
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='chk_scholarship_verification_status') THEN
    ALTER TABLE scholarships ADD CONSTRAINT chk_scholarship_verification_status CHECK (verification_status IN ('VERIFIED','NEEDS_VERIFICATION','EXPIRED','UNVERIFIED'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='chk_scholarship_status') THEN
    ALTER TABLE scholarships ADD CONSTRAINT chk_scholarship_status CHECK (status IN ('active','expired','draft','archived'));
  END IF;
END $$;

-- 2) College ↔ Scholarship relationship (§3)
CREATE TABLE IF NOT EXISTS college_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL DEFAULT 'INSTITUTIONAL',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(college_id, scholarship_id)
);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='chk_college_scholarship_rel_type') THEN
    ALTER TABLE college_scholarships ADD CONSTRAINT chk_college_scholarship_rel_type CHECK (relationship_type IN ('INSTITUTIONAL','UNIVERSITY','GOVERNMENT','STATE','PRIVATE','EXTERNAL'));
  END IF;
END $$;

-- 3) Saved scholarships (§20)
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- 4) Indexes (§24)
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_verification ON scholarships(verification_status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_scholarships_funding ON scholarships(funding_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_levels ON scholarships USING GIN(education_levels);
CREATE INDEX IF NOT EXISTS idx_scholarships_courses ON scholarships USING GIN(eligible_courses);
CREATE INDEX IF NOT EXISTS idx_scholarships_states ON scholarships USING GIN(eligible_states);
CREATE INDEX IF NOT EXISTS idx_scholarships_nationalities ON scholarships USING GIN(eligible_nationalities);
CREATE INDEX IF NOT EXISTS idx_college_scholarships_college ON college_scholarships(college_id);
CREATE INDEX IF NOT EXISTS idx_college_scholarships_scholarship ON college_scholarships(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user ON saved_scholarships(user_id);

-- 5) RLS
ALTER TABLE college_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public college_scholarships read" ON college_scholarships;
CREATE POLICY "Public college_scholarships read" ON college_scholarships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users read own saved scholarships" ON saved_scholarships;
CREATE POLICY "Users read own saved scholarships" ON saved_scholarships FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own saved scholarships" ON saved_scholarships;
CREATE POLICY "Users insert own saved scholarships" ON saved_scholarships FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own saved scholarships" ON saved_scholarships;
CREATE POLICY "Users delete own saved scholarships" ON saved_scholarships FOR DELETE USING (auth.uid() = user_id);

-- 6) Helper: mark expired automatically (run daily via pg_cron if enabled, otherwise app does it)
-- Application deadline passed -> status = expired (keeps historical records §16)
CREATE OR REPLACE FUNCTION navora_mark_expired_scholarships() RETURNS void AS $$
BEGIN
  UPDATE scholarships SET status='expired', verification_status='EXPIRED', last_updated_at=NOW()
  WHERE status='active' AND application_deadline IS NOT NULL AND application_deadline < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- 7) updated_at trigger
CREATE OR REPLACE FUNCTION navora_touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); NEW.last_updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_scholarships_touch ON scholarships;
CREATE TRIGGER trg_scholarships_touch BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION navora_touch_updated_at();
