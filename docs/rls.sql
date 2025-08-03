-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can select their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Authenticated users can see public profile data" ON profiles FOR SELECT TO authenticated USING (true);

-- RLS Policies for matches
CREATE POLICY "Users can select their own matches" ON matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can insert their own matches" ON matches FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for messages
CREATE POLICY "Users can select messages in their matches" ON messages FOR SELECT USING (
  match_id IN (SELECT id FROM matches WHERE user1_id = auth.uid() OR user2_id = auth.uid())
);
CREATE POLICY "Users can insert messages in their matches" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
