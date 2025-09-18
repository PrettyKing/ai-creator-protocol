-- AI Creator Protocol Database Schema
-- 注意：这些表需要在Supabase Dashboard中创建，或通过Migration运行

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- IP资产表
CREATE TABLE IF NOT EXISTS ip_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id),
    creator_address TEXT NOT NULL,
    content_type TEXT, -- 'image', 'video', 'audio', 'social-link'
    content_hash TEXT, -- IPFS hash
    metadata_hash TEXT, -- IPFS metadata hash
    social_url TEXT, -- 原始社交媒体链接
    social_metrics JSONB, -- 社交指标数据
    content_score INTEGER,
    grade TEXT,
    tx_hash TEXT,
    contract_address TEXT,
    token_id TEXT,
    ip_asset_id TEXT, -- Story Protocol ID
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 授权条款表
CREATE TABLE IF NOT EXISTS license_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_asset_id UUID REFERENCES ip_assets(id) ON DELETE CASCADE,
    commercial_use BOOLEAN DEFAULT FALSE,
    derivatives BOOLEAN DEFAULT FALSE,
    attribution BOOLEAN DEFAULT TRUE,
    share_alike BOOLEAN DEFAULT FALSE,
    territory TEXT[] DEFAULT '{}', -- 地区数组
    channels TEXT[] DEFAULT '{}', -- 渠道数组
    timeframe INTEGER, -- 授权期限(月)
    royalty NUMERIC(5,2), -- 版税比例
    created_at TIMESTAMP DEFAULT NOW()
);

-- 交易记录表
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_asset_id UUID REFERENCES ip_assets(id),
    from_address TEXT,
    to_address TEXT,
    tx_hash TEXT NOT NULL,
    tx_type TEXT, -- 'register', 'transfer', 'license'
    amount NUMERIC(18,8),
    gas_used BIGINT,
    gas_price BIGINT,
    block_number BIGINT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 收益记录表
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_asset_id UUID REFERENCES ip_assets(id),
    amount NUMERIC(18,8) NOT NULL,
    token_symbol TEXT DEFAULT 'ETH',
    source TEXT, -- 'reward', 'royalty', 'license'
    tx_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ip_assets_creator_address ON ip_assets(creator_address);
CREATE INDEX IF NOT EXISTS idx_ip_assets_status ON ip_assets(status);
CREATE INDEX IF NOT EXISTS idx_ip_assets_created_at ON ip_assets(created_at);
CREATE INDEX IF NOT EXISTS idx_ip_assets_content_score ON ip_assets(content_score);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_ip_asset_id ON transactions(ip_asset_id);
CREATE INDEX IF NOT EXISTS idx_earnings_user_id ON earnings(user_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为ip_assets表创建更新时间触发器
CREATE TRIGGER update_ip_assets_updated_at
    BEFORE UPDATE ON ip_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 用户只能查看和更新自己的数据
CREATE POLICY "用户可以查看自己的资料" ON users
    FOR SELECT USING (wallet_address = current_setting('custom.wallet_address', true));

CREATE POLICY "用户可以更新自己的资料" ON users
    FOR UPDATE USING (wallet_address = current_setting('custom.wallet_address', true));

-- IP资产的读取策略 (所有人可以查看已完成的资产，创建者可以查看自己的所有资产)
CREATE POLICY "所有人可以查看已完成的IP资产" ON ip_assets
    FOR SELECT USING (status = 'completed' OR creator_address = current_setting('custom.wallet_address', true));

CREATE POLICY "创建者可以管理自己的IP资产" ON ip_assets
    FOR ALL USING (creator_address = current_setting('custom.wallet_address', true));

-- 授权条款策略
CREATE POLICY "所有人可以查看授权条款" ON license_terms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ip_assets
            WHERE ip_assets.id = license_terms.ip_asset_id
            AND (ip_assets.status = 'completed' OR ip_assets.creator_address = current_setting('custom.wallet_address', true))
        )
    );

-- 交易记录策略
CREATE POLICY "用户可以查看相关交易" ON transactions
    FOR SELECT USING (
        from_address = current_setting('custom.wallet_address', true)
        OR to_address = current_setting('custom.wallet_address', true)
        OR EXISTS (
            SELECT 1 FROM ip_assets
            WHERE ip_assets.id = transactions.ip_asset_id
            AND ip_assets.creator_address = current_setting('custom.wallet_address', true)
        )
    );

-- 收益记录策略
CREATE POLICY "用户可以查看自己的收益" ON earnings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = earnings.user_id
            AND users.wallet_address = current_setting('custom.wallet_address', true)
        )
    );

-- 插入示例数据 (可选)
-- INSERT INTO users (wallet_address, username) VALUES
-- ('0x1234567890abcdef1234567890abcdef12345678', 'demo_user');

COMMENT ON TABLE users IS '用户表 - 存储钱包地址和用户信息';
COMMENT ON TABLE ip_assets IS 'IP资产表 - 存储所有注册的知识产权资产';
COMMENT ON TABLE license_terms IS '授权条款表 - 存储每个IP资产的授权条件';
COMMENT ON TABLE transactions IS '交易记录表 - 存储所有区块链交易';
COMMENT ON TABLE earnings IS '收益记录表 - 存储用户收益和奖励';