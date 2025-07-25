-- Migration: Create account_credentials table for authentication
CREATE TABLE IF NOT EXISTS account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_credentials_email ON account_credentials(email); 