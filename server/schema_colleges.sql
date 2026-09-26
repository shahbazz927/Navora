-- ============================================================================
-- NAVORA — India & Hyderabad Higher Education Institutions Database Schema
-- Normalized relational schema for scalable college discovery & verification
-- Compatible with PostgreSQL / Supabase
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS (Master table for universities & colleges)
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
  state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
  location VARCHAR(200) NOT NULL,
  institution_type VARCHAR(100) NOT NULL, -- 'Central University', 'State University', 'Autonomous', 'Private University', 'Deemed University', 'Government', 'Institute of National Importance (INI)'
  ownership VARCHAR(50) NOT NULL DEFAULT 'Private', -- 'Government', 'Private', 'Aided', 'Autonomous Trust'
  university_affiliation VARCHAR(200), -- 'Osmania University', 'JNTUH', 'KNRUHS', 'Autonomous', 'UGC Recognized'
  established_year INTEGER,
  autonomous_status BOOLEAN DEFAULT false,
  recognition VARCHAR(255) DEFAULT 'UGC Recognized',
  accreditation VARCHAR(255), -- 'NAAC A++ (Score 3.78)', 'NBA Tier-1 Accredited'
  nirf_rank VARCHAR(100), -- 'Rank #8 Engineering (NIRF 2024)', 'Rank #10 University (NIRF 2024)'
  website VARCHAR(300),
  admission_url VARCHAR(300),
  logo_url VARCHAR(300),
  description TEXT,
  hostel_available BOOLEAN DEFAULT false,
  total_courses_count INTEGER DEFAULT 0,
  min_annual_fee NUMERIC(12, 2),
  max_annual_fee NUMERIC(12, 2),
  status VARCHAR(50) DEFAULT 'published', -- 'published', 'draft', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAMPUSES
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  campus_name VARCHAR(150) NOT NULL DEFAULT 'Main Campus',
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
  state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
  pincode VARCHAR(20),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  level VARCHAR(50) NOT NULL, -- 'UG', 'PG', 'Integrated', 'Diploma', 'Doctoral'
  degree VARCHAR(100) NOT NULL, -- 'B.Tech', 'BBA', 'B.Com', 'MBBS', 'MBA', 'MCA', 'M.Tech', 'LL.B.'
  course_name VARCHAR(200) NOT NULL,
  specialization VARCHAR(150), -- 'Computer Science & Engineering', 'Finance', 'Data Science', 'Artificial Intelligence'
  duration VARCHAR(50) NOT NULL, -- '4 Years', '3 Years', '2 Years', '5.5 Years'
  eligibility TEXT NOT NULL,
  entrance_exam VARCHAR(150), -- 'TS EAMCET / TG EAPCET', 'JEE Main', 'CAT', 'TS ICET', 'NEET UG'
  admission_mode VARCHAR(100) DEFAULT 'State Counselling & Merit',
  course_source_url VARCHAR(300),
  academic_year VARCHAR(50) DEFAULT '2026-27',
  verified_date DATE DEFAULT CURRENT_DATE,
  verification_status VARCHAR(50) DEFAULT 'verified', -- 'verified', 'estimated', 'unverified', 'outdated', 'not_available'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FEES
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  fee_type VARCHAR(50) NOT NULL, -- 'Tuition', 'Hostel', 'Mess', 'Admission', 'Examination', 'Other'
  amount NUMERIC(12, 2) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'annual', -- 'annual', 'semester', 'one_time'
  academic_year VARCHAR(50) NOT NULL DEFAULT '2026-27',
  fee_source_url VARCHAR(300),
  verified_date DATE DEFAULT CURRENT_DATE,
  verification_status VARCHAR(50) DEFAULT 'verified', -- 'verified', 'estimated', 'unverified', 'outdated', 'not_available'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMISSIONS
CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  admission_process TEXT NOT NULL,
  entrance_exam VARCHAR(150),
  eligibility TEXT,
  counselling_authority VARCHAR(150), -- 'TSCHE (Telangana State Council of Higher Education)', 'MCC', 'JoSAA'
  application_url VARCHAR(300),
  admission_source_url VARCHAR(300),
  academic_year VARCHAR(50) DEFAULT '2026-27',
  verified_date DATE DEFAULT CURRENT_DATE,
  verification_status VARCHAR(50) DEFAULT 'verified',
  important_dates JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SCHOLARSHIPS
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  scholarship_name VARCHAR(200) NOT NULL,
  eligibility TEXT NOT NULL,
  benefit TEXT NOT NULL,
  application_process TEXT,
  source_url VARCHAR(300),
  academic_year VARCHAR(50) DEFAULT '2026-27',
  verified_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLACEMENTS
CREATE TABLE IF NOT EXISTS placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  placement_year VARCHAR(50) DEFAULT '2024-25',
  placement_rate NUMERIC(5, 2), -- 94.5%
  median_package NUMERIC(12, 2), -- In INR
  average_package NUMERIC(12, 2), -- In INR
  highest_package NUMERIC(12, 2), -- In INR
  top_recruiters TEXT[],
  placement_report_url VARCHAR(300),
  verified_date DATE DEFAULT CURRENT_DATE,
  verification_status VARCHAR(50) DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FACILITIES
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  facility_type VARCHAR(100) NOT NULL, -- 'Hostel', 'Library', 'Laboratories', 'Sports', 'Wi-Fi', 'Cafeteria', 'Transport', 'Incubation'
  facility_name VARCHAR(150) NOT NULL,
  available BOOLEAN DEFAULT true,
  description TEXT,
  source_url VARCHAR(300),
  verified_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INSTITUTION SOURCES (Provenance & Audit)
CREATE TABLE IF NOT EXISTS institution_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  source_type VARCHAR(100) NOT NULL, -- 'Official Institution', 'UGC', 'AISHE', 'NIRF', 'NAAC', 'NBA', 'TSCHE / AFRC', 'Government'
  source_url VARCHAR(300) NOT NULL,
  academic_year VARCHAR(50) DEFAULT '2026-27',
  verified_date DATE DEFAULT CURRENT_DATE,
  verification_status VARCHAR(50) DEFAULT 'verified',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SAVED COLLEGES (User bookmarking)
CREATE TABLE IF NOT EXISTS saved_colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, institution_id)
);

-- 11. INDEXES for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_city ON institutions(city);
CREATE INDEX IF NOT EXISTS idx_institutions_state ON institutions(state);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(institution_type);
CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_degree ON courses(degree);
CREATE INDEX IF NOT EXISTS idx_courses_specialization ON courses(specialization);
CREATE INDEX IF NOT EXISTS idx_fees_institution ON fees(institution_id);
CREATE INDEX IF NOT EXISTS idx_saved_colleges_user ON saved_colleges(user_id);

-- RLS POLICIES
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;

-- Read policy: Public can read published data
CREATE POLICY "Public institutions read access" ON institutions FOR SELECT USING (status = 'published');
CREATE POLICY "Public campuses read access" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public courses read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Public fees read access" ON fees FOR SELECT USING (true);
CREATE POLICY "Public admissions read access" ON admissions FOR SELECT USING (true);
CREATE POLICY "Public scholarships read access" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Public placements read access" ON placements FOR SELECT USING (true);
CREATE POLICY "Public facilities read access" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public sources read access" ON institution_sources FOR SELECT USING (true);

-- Saved colleges: Users can only read/manage their own saved colleges
CREATE POLICY "Users can read own saved colleges" ON saved_colleges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved colleges" ON saved_colleges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved colleges" ON saved_colleges FOR DELETE USING (auth.uid() = user_id);
