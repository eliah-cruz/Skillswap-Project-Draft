--1. CLEANUP PRE-EXISTING OBJECTS WITH CASCADE
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS desired_skills CASCADE;
DROP TABLE IF EXISTS teachable_skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;

-- INITIALIZE CORE CONFIGURATIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE MASTER TABLES
CREATE TABLE skill_categories (
  category_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE skills ( 
  skill_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  skill_name TEXT NOT NULL UNIQUE, 
  category_id UUID NOT NULL REFERENCES skill_categories(category_id) ON DELETE RESTRICT 
); 

CREATE TABLE users ( 
  user_id UUID PRIMARY KEY,
  username TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE, 
  title TEXT DEFAULT 'SkillSwapper', 
  bio TEXT DEFAULT '', 
  location TEXT DEFAULT 'Philippines', 
  availability TEXT DEFAULT 'Flexible', 
  experience_level TEXT DEFAULT 'Beginner',
  average_rating NUMERIC(2,1) DEFAULT 0.0 CHECK (average_rating BETWEEN 0.0 AND 5.0), 
  review_count INT DEFAULT 0 CHECK (review_count >= 0), 
  is_online BOOLEAN DEFAULT TRUE, 
  is_hidden BOOLEAN DEFAULT FALSE, 
  is_searching BOOLEAN DEFAULT TRUE, 
  hours_balance INT DEFAULT 3 CHECK (hours_balance >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() 
);

CREATE TABLE teachable_skills ( 
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
  skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE, 
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE desired_skills ( 
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
  skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE matches (
  match_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
  match_type TEXT NOT NULL CHECK (match_type IN ('Direct', 'Circular')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  CHECK (mentor_id <> student_id)
);

CREATE TABLE messages (
  message_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  file_name TEXT DEFAULT NULL,
  file_url TEXT DEFAULT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE reviews (
  review_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (match_id, reviewer_id),
  CHECK (reviewer_id <> reviewee_id)
);

CREATE TABLE blocks (
  block_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE TABLE reports (
  report_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('Spam', 'Harassment', 'No-show', 'Inappropriate Content', 'Other')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Resolved', 'Dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (reporter_id <> reported_id)
);

CREATE TABLE user_settings (
  setting_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  show_online_status BOOLEAN DEFAULT TRUE,
  profile_visibility TEXT NOT NULL DEFAULT 'Public' CHECK (profile_visibility IN ('Public', 'Matches Only', 'Hidden'))
);

-- 3. INDEX ENGINE OPTIMIZATIONS
CREATE INDEX idx_teachable_skills_user ON teachable_skills(user_id);
CREATE INDEX idx_teachable_skills_skill ON teachable_skills(skill_id);
CREATE INDEX idx_desired_skills_user ON desired_skills(user_id);
CREATE INDEX idx_desired_skills_skill ON desired_skills(skill_id);
CREATE INDEX idx_messages_match ON messages(match_id, timestamp);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);


-- 4. DATABASE AUTOMATION TRIGGERS (With SECURITY DEFINER)
-- Dynamic Rating & Warning Calculator Trigger
CREATE OR REPLACE FUNCTION update_user_average_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.reviewee_id;
  ELSE
    target_user_id := NEW.reviewee_id;
  END IF;

  UPDATE users
  SET
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM reviews WHERE reviewee_id = target_user_id
    ), 0.0),
    review_count = (
      SELECT COUNT(*) FROM reviews WHERE reviewee_id = target_user_id
    ),
    is_hidden = COALESCE((
      SELECT ROUND(AVG(rating)::NUMERIC, 1) < 4.0 FROM reviews WHERE reviewee_id = target_user_id
    ), false)
  WHERE user_id = target_user_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_user_average_rating();

-- Match Timestamp Automation
CREATE OR REPLACE FUNCTION update_match_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_match_last_updated
BEFORE UPDATE ON matches
FOR EACH ROW EXECUTE FUNCTION update_match_timestamp();

-- Passthrough Registration Settings Trigger (With duplicate insertion protection)
CREATE OR REPLACE FUNCTION passthrough_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) 
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_user_settings
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION passthrough_user_settings();

-- Automatic Time-Bank Ledger Transaction Trigger (Amended for Low Rating Rules)
CREATE OR REPLACE FUNCTION process_barter_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct and award barter hour balance ONLY for positive sessions (rating >= 4)
  IF NEW.rating >= 4 THEN
    UPDATE users 
    SET hours_balance = hours_balance - 1 
    WHERE user_id = NEW.reviewer_id;

    UPDATE users 
    SET hours_balance = hours_balance + 1 
    WHERE user_id = NEW.reviewee_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_barter_transaction
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION process_barter_transaction();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachable_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE desired_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Skills metadata visibility
CREATE POLICY "Skills visible to everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Categories visible to everyone" ON skill_categories FOR SELECT USING (true);

-- User Profiles
CREATE POLICY "Profiles visible to authenticated members" ON users FOR SELECT USING (true);
CREATE POLICY "Profiles insertable by authenticated creators" ON users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Profiles modifiable by unique owner identity" ON users FOR UPDATE USING (auth.uid() = user_id);

-- Teachable Skills
CREATE POLICY "Teachable mapping visible" ON teachable_skills FOR SELECT USING (true);
CREATE POLICY "Teachable mapping insertable" ON teachable_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachable mapping deletable" ON teachable_skills FOR DELETE USING (auth.uid() = user_id);

-- Desired Skills
CREATE POLICY "Desired mapping visible" ON desired_skills FOR SELECT USING (true);
CREATE POLICY "Desired mapping insertable" ON desired_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Desired mapping deletable" ON desired_skills FOR DELETE USING (auth.uid() = user_id);

-- Matches (Allows participants & Admin)
CREATE POLICY "Matches visible to participants and admin" ON matches FOR SELECT USING (
  auth.uid() = mentor_id OR 
  auth.uid() = student_id OR 
  lower(auth.jwt() ->> 'email') = 'skillswapproductions@gmail.com'
);
CREATE POLICY "Matches insertable by participants" ON matches FOR INSERT WITH CHECK (auth.uid() = mentor_id OR auth.uid() = student_id);
CREATE POLICY "Matches deletable by participants" ON matches FOR DELETE USING (auth.uid() = mentor_id OR auth.uid() = student_id);

-- Messages
CREATE POLICY "Messages accessible via participant bounds" ON messages FOR SELECT USING (
  auth.uid() IN (
    SELECT mentor_id FROM matches WHERE match_id = messages.match_id 
    UNION 
    SELECT student_id FROM matches WHERE match_id = messages.match_id
  )
);
CREATE POLICY "Messages appendable by authentic sender" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews
CREATE POLICY "Reviews displayable to public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviews appendable by distinct author" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Blocks
CREATE POLICY "Blocks visible to owner" ON blocks FOR SELECT USING (auth.uid() = blocker_id);
CREATE POLICY "Blocks insertable by owner" ON blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Blocks deletable by owner" ON blocks FOR DELETE USING (auth.uid() = blocker_id);

-- Policy to allow System Administrator to programmatically unblock users during mediation
CREATE POLICY "Blocks deletable by admin" ON blocks FOR DELETE USING (
  lower(auth.jwt() ->> 'email') = 'skillswapproductions@gmail.com'
);

-- Reports (Allows creation by reporters, viewing by reporter & admin, and updates by admin)
CREATE POLICY "Reports insertable by reporter" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reports selectable by reporter and system admin" ON reports FOR SELECT USING (
  auth.uid() = reporter_id OR 
  lower(auth.jwt() ->> 'email') = 'skillswapproductions@gmail.com'
);
CREATE POLICY "Reports updatable by system admin" ON reports FOR UPDATE USING (
  lower(auth.jwt() ->> 'email') = 'skillswapproductions@gmail.com'
);

-- Settings
CREATE POLICY "Settings selectable by owner" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Settings insertable by owner" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Settings updatable by owner" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- 6. CORE SEED PIPELINE DATA (CATEGORIES & SKILLS)
-- 1. Insert Categories
INSERT INTO skill_categories (category_name) VALUES 
('Development'), ('Design'), ('Languages'), ('Marketing'), ('Business'), ('Culinary'), ('Life Skills')
ON CONFLICT (category_name) DO NOTHING;

-- 2. Insert Skills accurately mapped from data.ts
INSERT INTO skills (skill_name, category_id) VALUES 
-- Development
('React', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('Next.js', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('Python', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('JavaScript', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('HTML/CSS', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('C++', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('Java', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('Swift', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('SQL', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('DevOps', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),
('Cybersecurity', (SELECT category_id FROM skill_categories WHERE category_name = 'Development')),

-- Design
('UI/UX', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Figma', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Photoshop', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Video Editing', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('3D Modeling', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Branding', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Typography', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),
('Prototyping', (SELECT category_id FROM skill_categories WHERE category_name = 'Design')),

-- Languages
('English', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('Spanish', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('Mandarin', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('French', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('Japanese', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('German', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('Arabic', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),
('Sign Language', (SELECT category_id FROM skill_categories WHERE category_name = 'Languages')),

-- Business
('Public Speaking', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Accounting', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Project Management', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Leadership', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Finance', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Startup Fundraising', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),
('Sales', (SELECT category_id FROM skill_categories WHERE category_name = 'Business')),

-- Culinary
('Baking', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),
('Culinary Arts', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),
('Vegan Cooking', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),
('Sushi Making', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),
('Barista/Coffee Art', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),
('BBQ & Grilling', (SELECT category_id FROM skill_categories WHERE category_name = 'Culinary')),

-- Life Skills
('Carpentry', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),
('Car Maintenance', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),
('Gardening', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),
('Fitness Training', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),
('Yoga', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),
('Personal Finance', (SELECT category_id FROM skill_categories WHERE category_name = 'Life Skills')),

-- Marketing
('SEO', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Ads', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Copywriting', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Analytics', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Email Marketing', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Strategy', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing')),
('Social Media', (SELECT category_id FROM skill_categories WHERE category_name = 'Marketing'))
ON CONFLICT (skill_name) DO NOTHING;

-- 7. ENABLE REALTIME REPLICATION FOR INSTANT SWAPPING SYNCHRONIZATION
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE teachable_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE desired_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE blocks;