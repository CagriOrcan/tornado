-- Add push_token column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Add index for faster push token lookups
CREATE INDEX IF NOT EXISTS idx_profiles_push_token 
ON profiles(push_token) 
WHERE push_token IS NOT NULL;

-- Add read_at column to messages for tracking read status
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add index for unread messages queries
CREATE INDEX IF NOT EXISTS idx_messages_read_status 
ON messages(sender_id, read_at) 
WHERE read_at IS NULL;