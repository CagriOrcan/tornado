-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  birth_date DATE,
  city TEXT,
  bio TEXT,
  interests TEXT[],
  avatar_url TEXT,
  is_searching BOOLEAN DEFAULT false
);

-- Create the matches table
CREATE TYPE match_status AS ENUM ('searching', 'active', 'reveal_pending', 'revealed', 'ended_by_user', 'ended_by_timer');

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user1_id UUID REFERENCES profiles(id),
  user2_id UUID REFERENCES profiles(id),
  status match_status,
  user1_consent BOOLEAN DEFAULT false,
  user2_consent BOOLEAN DEFAULT false
);

-- Create the messages table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  match_id UUID REFERENCES matches(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT
);
