# Supabase 数据库配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://app.supabase.com/) 并登录或注册账号
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - 项目名称：ai-creator-protocol
   - 数据库密码：设置一个强密码
   - 选择地理位置（建议选择离您最近的区域）
4. 等待项目创建完成（约2分钟）

## 2. 获取 API 密钥

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 点击 "API" 选项卡
3. 复制以下密钥：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJ...`
   - **Service Role Key**: `eyJhbGciOiJ...`（用于服务端调用）

## 3. 配置环境变量

在项目根目录的 `.env` 文件中更新以下变量：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Anon Key
SUPABASE_SERVICE_ROLE_KEY=你的Service Role Key
```

## 4. 运行数据库迁移

### 方法一：使用 SQL 编辑器（推荐）

1. 在 Supabase 仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase/migrations/001_initial_schema.sql` 文件的内容
4. 粘贴到查询编辑器中
5. 点击 "Run" 执行 SQL 脚本

### 方法二：使用 Supabase CLI

1. 安装 Supabase CLI：
   ```bash
   npm install -g supabase
   ```

2. 登录到 Supabase：
   ```bash
   supabase login
   ```

3. 链接到你的项目：
   ```bash
   supabase link --project-ref 你的项目ID
   ```

4. 运行迁移：
   ```bash
   supabase db push
   ```

## 5. 验证数据库设置

1. 在 Supabase 仪表板中，点击 "Table Editor"
2. 确认以下表已创建：
   - users
   - ip_assets
   - social_integrations
   - licenses

## 6. 配置认证（可选）

如果需要使用 Supabase 认证功能：

1. 在 Supabase 仪表板中，点击 "Authentication"
2. 配置认证提供商（如 Email、Google、GitHub 等）
3. 设置重定向 URL：
   - 开发环境：`http://localhost:3000`
   - 生产环境：`你的域名`

## 7. 测试连接

启动开发服务器并测试数据库连接：

```bash
npm run dev
```

访问 `http://localhost:3000/dashboard`，如果能正常显示页面并且没有错误，说明数据库配置成功。

## 常见问题

### 问题 1：CORS 错误
**解决方案**：在 Supabase 仪表板的 Authentication > URL Configuration 中添加你的域名到允许列表。

### 问题 2：RLS（行级安全）策略阻止访问
**解决方案**：
1. 检查 SQL 迁移脚本中的 RLS 策略是否正确执行
2. 在开发阶段，可以临时禁用 RLS（不建议在生产环境中这样做）：
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE ip_assets DISABLE ROW LEVEL SECURITY;
   ALTER TABLE social_integrations DISABLE ROW LEVEL SECURITY;
   ALTER TABLE licenses DISABLE ROW LEVEL SECURITY;
   ```

### 问题 3：数据库连接超时
**解决方案**：
1. 检查网络连接
2. 确认 Supabase 项目状态为 "Active"
3. 尝试更换到其他地理位置的项目

## 下一步

配置完成后，你可以：

1. 使用钱包连接应用
2. 上传数字资产
3. 在仪表板查看资产数据
4. 生成 AI 授权条款
5. 注册 IP 资产到 Story Protocol

## 支持

如有问题，请参考：
- [Supabase 文档](https://supabase.com/docs)
- [项目 GitHub Issues](https://github.com/your-repo/issues)