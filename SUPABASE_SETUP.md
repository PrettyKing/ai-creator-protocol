# Supabase 数据库配置指南

## 🚀 快速开始

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "Start your project"
3. 使用GitHub登录
4. 点击 "New project"
5. 填写项目信息：
   - Name: `ai-creator-protocol`
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域
6. 等待项目创建完成（约2分钟）

### 2. 获取API密钥

在项目Dashboard中：

1. 点击左侧 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ0eXAiOiJKV1QiLCJhbGc...`
   - **service_role key**: `eyJ0eXAiOiJKV1QiLCJhbGc...` (⚠️ 保密)

### 3. 更新环境变量

在 `.env` 文件中更新：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. 创建数据库表结构

#### 方法一：使用SQL编辑器（推荐）

1. 在Supabase Dashboard中，点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/init.sql` 中的所有内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行

#### 方法二：使用表编辑器

在 "Table Editor" 中手动创建以下表：

**users 表:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

**ip_assets 表:**
```sql
CREATE TABLE ip_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id),
    creator_address TEXT NOT NULL,
    content_type TEXT,
    content_hash TEXT,
    metadata_hash TEXT,
    social_url TEXT,
    social_metrics JSONB,
    content_score INTEGER,
    grade TEXT,
    tx_hash TEXT,
    contract_address TEXT,
    token_id TEXT,
    ip_asset_id TEXT,
    status TEXT DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

继续添加其他表...（参考 `database/init.sql`）

### 5. 配置行级安全策略 (RLS)

为了数据安全，需要启用RLS：

1. 在 "Table Editor" 中选择表
2. 点击表设置
3. 启用 "Enable Row Level Security"
4. 添加策略（参考 `database/init.sql`）

### 6. 验证连接

运行以下命令测试连接：

```bash
npm run dev
```

在浏览器控制台检查是否有数据库连接错误。

## 📊 数据库架构说明

### 核心表结构

```
users (用户表)
├── id (UUID, 主键)
├── wallet_address (钱包地址)
├── username (用户名)
└── created_at (创建时间)

ip_assets (IP资产表)
├── id (UUID, 主键)
├── title (标题)
├── creator_address (创建者地址)
├── content_hash (内容哈希)
├── tx_hash (交易哈希)
├── status (状态: processing/completed/failed)
└── created_at (创建时间)

license_terms (授权条款表)
├── id (UUID, 主键)
├── ip_asset_id (关联IP资产)
├── commercial_use (商业使用)
├── derivatives (衍生作品)
└── royalty (版税比例)

transactions (交易记录表)
├── id (UUID, 主键)
├── ip_asset_id (关联IP资产)
├── tx_hash (交易哈希)
├── tx_type (交易类型)
└── status (状态)

earnings (收益记录表)
├── id (UUID, 主键)
├── user_id (关联用户)
├── amount (收益金额)
├── source (收益来源)
└── created_at (创建时间)
```

### 关系说明

- **users → ip_assets**: 一对多关系
- **ip_assets → license_terms**: 一对一关系
- **ip_assets → transactions**: 一对多关系
- **users → earnings**: 一对多关系

## 🔧 高级配置

### 1. 实时订阅

启用实时功能：

```typescript
// 监听资产状态变化
const subscription = supabase
  .channel('ip_assets_changes')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'ip_assets'
  }, (payload) => {
    console.log('资产状态更新:', payload)
  })
  .subscribe()
```

### 2. 存储配置

如果需要存储文件：

1. 在Dashboard中点击 "Storage"
2. 创建新的bucket: `ip-assets`
3. 配置访问策略
4. 更新上传逻辑使用Supabase Storage

### 3. Edge Functions

部署服务端逻辑：

```bash
supabase functions new process-social-media
supabase functions deploy process-social-media
```

## 📈 性能优化

### 索引建议

```sql
-- 为常用查询字段创建索引
CREATE INDEX idx_ip_assets_creator_address ON ip_assets(creator_address);
CREATE INDEX idx_ip_assets_status ON ip_assets(status);
CREATE INDEX idx_ip_assets_created_at ON ip_assets(created_at DESC);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
```

### 查询优化

- 使用 `select()` 指定需要的字段
- 合理使用 `limit()` 限制结果数量
- 利用 `order()` 和索引优化排序

## 🔒 安全最佳实践

1. **永远不要在客户端代码中使用 service_role key**
2. **启用RLS并配置适当的策略**
3. **定期轮换API密钥**
4. **使用环境变量存储敏感信息**
5. **监控异常查询和访问模式**

## 🚨 故障排除

### 常见问题

**1. 连接失败**
- 检查环境变量是否正确
- 确认项目URL和密钥匹配
- 验证网络连接

**2. RLS策略阻止访问**
- 检查策略配置
- 确认用户权限
- 临时禁用RLS测试

**3. 查询性能问题**
- 检查是否缺少索引
- 分析查询执行计划
- 优化查询语句

### 调试工具

```typescript
// 启用详细日志
const { data, error } = await supabase
  .from('ip_assets')
  .select('*')
  .eq('creator_address', address)

console.log('查询结果:', { data, error })
```

## 📞 获取帮助

- [Supabase官方文档](https://supabase.com/docs)
- [Supabase Discord社区](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**设置完成后，重启开发服务器验证配置：**

```bash
npm run dev
```

访问 `http://localhost:3000/dashboard` 测试数据库集成功能。