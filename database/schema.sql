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
  user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  username TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE, 
  title TEXT, 
  bio TEXT, 
  location TEXT, 
  availability TEXT, 
  average_rating NUMERIC(2,1) DEFAULT 0.0 CHECK (average_rating BETWEEN 0.0 AND 5.0), 
  review_count INT DEFAULT 0 CHECK (review_count >= 0), 
  is_online BOOLEAN DEFAULT FALSE, 
  is_hidden BOOLEAN DEFAULT FALSE, 
  is_searching BOOLEAN DEFAULT TRUE, 
  created_at TIMESTAMPTZ DEFAULT NOW() 
);

-- just add new ones later on (starter for now)
INSERT INTO skill_categories (category_name) VALUES 
('Development'), 
('Design'), 
('Languages'), 
('Marketing'), 
('Business'), 
('Culinary'), 
('Life Skills'); 

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
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed')), -- starts as 'Pending' until an admin acts on it
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  CHECK (mentor_id <> student_id) --mentor_id != student_id
);

CREATE TABLE messages (
  message_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0),
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
  UNIQUE (match_id, reviewer_id), -- one review per reviewer per match
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

-- the matching engine will query these two tables constantly
CREATE INDEX idx_teachable_skills_user ON teachable_skills(user_id);
CREATE INDEX idx_teachable_skills_skill ON teachable_skills(skill_id);
CREATE INDEX idx_desired_skills_user ON desired_skills(user_id);
CREATE INDEX idx_desired_skills_skill ON desired_skills(skill_id);

-- messages are fetched by match, sorted by time
CREATE INDEX idx_messages_match ON messages(match_id, timestamp);

-- unread badge counts per user
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- reviews are looked up by reviewee to compute average_rating
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- block lookups happen on every dashboard render to exclude blocked users
CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);

CREATE OR REPLACE FUNCTION update_user_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    average_rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 1)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    is_hidden = ( -- hides user when rating is below 4
      SELECT ROUND(AVG(rating)::NUMERIC, 1) < 4.0
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE user_id = NEW.reviewee_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_rating
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_user_average_rating();

CREATE OR REPLACE FUNCTION update_match_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_match_last_updated
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_match_timestamp();

CREATE OR REPLACE FUNCTION check_teachable_skill_limit() -- checks 5 teachable skill limit
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM teachable_skills WHERE user_id = NEW.user_id
  ) >= 5 THEN
    RAISE EXCEPTION 'Users may not list more than 5 teachable skills.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teachable_skill_limit
BEFORE INSERT ON teachable_skills
FOR EACH ROW
EXECUTE FUNCTION check_teachable_skill_limit();

CREATE OR REPLACE FUNCTION check_desired_skill_limit() -- checks 5 desired skill limit
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM desired_skills WHERE user_id = NEW.user_id
  ) >= 5 THEN
    RAISE EXCEPTION 'Users may not list more than 5 desired skills.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_desired_skill_limit
BEFORE INSERT ON desired_skills
FOR EACH ROW
EXECUTE FUNCTION check_desired_skill_limit();

-- for security --

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachable_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE desired_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- anyone can read public profiles only owner can update
CREATE POLICY "Public profiles are viewable" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = user_id);

-- skills: public read, owner write
CREATE POLICY "Public teachable skills read" ON teachable_skills
  FOR SELECT USING (true);

CREATE POLICY "Owner manages teachable skills" ON teachable_skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public desired skills read" ON desired_skills
  FOR SELECT USING (true);

CREATE POLICY "Owner manages desired skills" ON desired_skills
  FOR ALL USING (auth.uid() = user_id);

-- only participants can read or update their match
CREATE POLICY "Match participants can view" ON matches
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = student_id);

CREATE POLICY "Match participants can update status" ON matches
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = student_id);

-- only participants of the match can read/write
CREATE POLICY "Match participants can read messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT mentor_id FROM matches WHERE match_id = messages.match_id
      UNION
      SELECT student_id FROM matches WHERE match_id = messages.match_id
    )
  );

CREATE POLICY "Sender can insert message" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- public read, only reviewer can insert their own
CREATE POLICY "Reviews are public" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Reviewer can submit review" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Blocks/Reports: private to the user who created them
CREATE POLICY "Owner can manage blocks" ON blocks
  FOR ALL USING (auth.uid() = blocker_id);

CREATE POLICY "Owner can manage reports" ON reports
  FOR ALL USING (auth.uid() = reporter_id);

-- settings private
CREATE POLICY "Owner can manage settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);