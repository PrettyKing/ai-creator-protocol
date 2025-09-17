# 环境变量配置指南

## 🚀 快速开始

复制并重命名环境变量文件：
```bash
cp .env.example .env.local
```

## 📋 必要的API密钥配置

### 1. OpenAI API Key (必需)
用于AI授权助手功能
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**获取方式：**
1. 访问 [OpenAI API](https://platform.openai.com/api-keys)
2. 登录并创建新的API Key
3. 复制并粘贴到.env.local文件

### 2. WalletConnect Project ID (必需)
用于Web3钱包连接功能
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
```

**获取方式：**
1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 复制Project ID

### 3. Pinata API Keys (推荐)
用于IPFS文件存储功能
```env
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key
```

**获取方式：**
1. 访问 [Pinata](https://pinata.cloud/)
2. 注册并登录
3. 前往API Keys页面
4. 创建新的API Key

### 4. Story Protocol配置 (高级)
用于真实的链上IP资产注册
```env
STORY_PROTOCOL_API_KEY=your-story-protocol-key
STORY_PROTOCOL_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
```

**获取方式：**
1. 访问 [Story Protocol](https://storyprotocol.xyz/)
2. 获取API访问权限
3. 配置Infura RPC节点

## 🛠 可选配置

### 区块链网络设置
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
```

### 社交媒体API (未来扩展)
```env
DOUYIN_APP_ID=your-douyin-app-id
DOUYIN_APP_SECRET=your-douyin-app-secret
XIAOHONGSHU_API_KEY=your-xiaohongshu-api-key
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
```

## 📝 完整的.env.local示例

```env
# OpenAI API Key (用于AI授权助手) - 现在在服务端使用
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# WalletConnect Project ID (用于钱包连接)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-actual-walletconnect-id

# Pinata API Keys (用于IPFS存储)
PINATA_API_KEY=your-actual-pinata-api-key
PINATA_SECRET_API_KEY=your-actual-pinata-secret-key

# Story Protocol相关配置
STORY_PROTOCOL_API_KEY=your-story-protocol-key
STORY_PROTOCOL_RPC_URL=https://sepolia.infura.io/v3/your-actual-infura-key

# 区块链网络配置
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia

# 环境标识
NODE_ENV=development
```

## ⚠️ 安全提示

1. **永远不要提交.env.local文件到Git仓库**
2. **使用真实的API密钥替换示例值**
3. **定期轮换API密钥**
4. **生产环境使用单独的API密钥**

## 🧪 测试配置

启动开发服务器测试配置：
```bash
npm run dev
```

访问 http://localhost:3000 检查：
- [x] 钱包连接功能
- [x] 文件上传到IPFS
- [x] AI授权助手生成
- [x] 社交媒体解析

## 🚨 故障排除

### 常见问题

**1. "OpenAI API Key not configured" 错误**
- 检查OPENAI_API_KEY是否正确配置
- 确保没有前缀`NEXT_PUBLIC_`

**2. "IPFS服务配置不可用" 错误**
- 检查PINATA_API_KEY和PINATA_SECRET_API_KEY
- 确认Pinata账户有效且有余额

**3. 钱包连接失败**
- 检查NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
- 确认WalletConnect项目状态正常

**4. 构建失败**
- 删除.next文件夹：`rm -rf .next`
- 重新安装依赖：`npm install`
- 重新构建：`npm run build`

## 📞 获取帮助

如果遇到配置问题，请检查：
1. 环境变量文件名是否正确（.env.local）
2. API密钥格式是否正确
3. 网络连接是否正常
4. 服务商API配额是否足够