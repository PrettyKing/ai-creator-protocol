# Pinata API 配置指南

## 🔑 获取Pinata API密钥

### 步骤1: 注册Pinata账户
1. 访问 [https://pinata.cloud/](https://pinata.cloud/)
2. 点击 "Sign Up" 注册新账户
3. 验证邮箱并登录

### 步骤2: 创建API密钥
1. 登录后，点击右上角头像进入设置
2. 在左侧菜单选择 "API Keys"
3. 点击 "New Key" 创建新的API密钥
4. 配置权限：
   - Admin: 开启 (完整权限)
   - 或者只选择需要的权限：
     - pinFileToIPFS
     - pinJSONToIPFS
     - pinList
     - unpin

### 步骤3: 复制API密钥
创建成功后会显示：
- **API Key**: 你的Pinata API密钥
- **API Secret**: 你的Pinata Secret密钥

⚠️ **重要**: Secret密钥只会显示一次，请立即保存！

### 步骤4: 配置环境变量
将获取的密钥添加到 `.env` 文件：

```env
# Pinata API Keys (用于IPFS存储)
PINATA_API_KEY=your-actual-pinata-api-key
PINATA_SECRET_API_KEY=your-actual-pinata-secret-key
```

### 步骤5: 测试配置
重启开发服务器：
```bash
npm run dev
```

上传文件测试IPFS功能是否正常工作。

## 📋 免费额度
Pinata免费计划包括：
- 1GB存储空间
- 无限制的请求
- 基础分析功能

对于MVP开发完全够用。

## 🔧 故障排除

### 常见错误
1. **"Pinata API Key not configured"**
   - 检查环境变量名称是否正确
   - 确认密钥没有多余的空格

2. **"Authentication failed"**
   - 验证API密钥是否正确
   - 检查Secret密钥是否匹配

3. **"Request failed"**
   - 确认网络连接正常
   - 检查Pinata服务状态

### 验证配置
可以通过Pinata API测试连接：
```bash
curl -X GET \
  'https://api.pinata.cloud/data/testAuthentication' \
  -H 'pinata_api_key: YOUR_API_KEY' \
  -H 'pinata_secret_api_key: YOUR_SECRET_KEY'
```

应该返回：
```json
{
  "message": "Congratulations! You are communicating with the Pinata API!"
}
```