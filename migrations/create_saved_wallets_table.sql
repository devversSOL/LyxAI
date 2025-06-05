-- Create saved_wallets table
CREATE TABLE IF NOT EXISTS saved_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  name TEXT,
  description TEXT NOT NULL,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on address for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_wallets_address ON saved_wallets(address);

-- Create index on user_id for future user-specific queries
CREATE INDEX IF NOT EXISTS idx_saved_wallets_user_id ON saved_wallets(user_id);

-- Add RLS policies (when you implement authentication)
-- ALTER TABLE saved_wallets ENABLE ROW LEVEL SECURITY;

-- Example policy (uncomment when you implement authentication)
-- CREATE POLICY "Users can only see their own wallets" ON saved_wallets
--   FOR SELECT USING (auth.uid() = user_id);
