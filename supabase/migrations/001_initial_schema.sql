-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ip_assets table
CREATE TABLE IF NOT EXISTS ip_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    ipfs_hash VARCHAR(255) NOT NULL,
    ip_id VARCHAR(255),
    license_terms JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create social_integrations table
CREATE TABLE IF NOT EXISTS social_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'xiaohongshu', 'youtube')),
    account_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    metrics JSONB DEFAULT '{}',
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform, account_id)
);

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES ip_assets(id) ON DELETE CASCADE,
    licensee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    license_type VARCHAR(50) NOT NULL,
    terms JSONB NOT NULL,
    price DECIMAL(18, 6),
    royalty_percentage DECIMAL(5, 2),
    transaction_hash VARCHAR(66),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ip_assets_user_id ON ip_assets(user_id);
CREATE INDEX idx_ip_assets_status ON ip_assets(status);
CREATE INDEX idx_social_integrations_user_id ON social_integrations(user_id);
CREATE INDEX idx_licenses_asset_id ON licenses(asset_id);
CREATE INDEX idx_licenses_licensee_id ON licenses(licensee_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_assets_updated_at BEFORE UPDATE ON ip_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_integrations_updated_at BEFORE UPDATE ON social_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = wallet_address);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Users can manage their own IP assets
CREATE POLICY "Users can view own assets" ON ip_assets
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can create own assets" ON ip_assets
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can update own assets" ON ip_assets
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can delete own assets" ON ip_assets
    FOR DELETE USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

-- Public can view registered assets
CREATE POLICY "Public can view registered assets" ON ip_assets
    FOR SELECT USING (status = 'registered');

-- Similar policies for social_integrations
CREATE POLICY "Users can manage own social integrations" ON social_integrations
    FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

-- License policies
CREATE POLICY "Users can view licenses for their assets" ON licenses
    FOR SELECT USING (
        asset_id IN (SELECT id FROM ip_assets WHERE user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text))
        OR licensee_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text)
    );

CREATE POLICY "Users can create licenses for their assets" ON licenses
    FOR INSERT WITH CHECK (
        asset_id IN (SELECT id FROM ip_assets WHERE user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text))
    );