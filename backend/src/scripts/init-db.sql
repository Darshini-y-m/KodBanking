-- Kodbank database schema for AIVEN PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS kodusers (
  uid BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'Customer' CHECK (role IN ('Customer', 'manager', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JWT token storage
CREATE TABLE IF NOT EXISTS cjwt (
  tid BIGSERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  uid BIGINT NOT NULL REFERENCES kodusers(uid) ON DELETE CASCADE,
  expiry TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cjwt_token ON cjwt(token);
CREATE INDEX IF NOT EXISTS idx_cjwt_uid ON cjwt(uid);
CREATE INDEX IF NOT EXISTS idx_cjwt_expiry ON cjwt(expiry);
CREATE INDEX IF NOT EXISTS idx_kodusers_username ON kodusers(username);
