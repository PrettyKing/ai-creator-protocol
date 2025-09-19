# AI Creator Protocol

基于Story Protocol的创作者版权保护与变现平台

## 🚀 项目简介

AI Creator Protocol 是一个创新的Web3创作者经济平台，帮助社交媒体创作者通过AI授权助手和Story Protocol完成：

- 📝 **内容注册** - 将创作内容注册为链上IP资产
- 🤖 **AI授权助手** - 智能生成标准授权条款
- 🔐 **链上确权** - 部署智能合约，建立不可篡改的版权证明
- 💰 **代币奖励** - 基于内容影响力评分获得平台代币
- 🗄️ **数据持久化** - Supabase数据库集成，完整的用户资产管理

## ✨ 核心功能

### 1. 内容注册
- 支持上传图片/视频文件
- 支持输入社交媒体链接（抖音、小红书、Instagram等）
- 自动解析内容元数据并评分

### 2. AI授权助手
- 通过智能问答了解用户偏好
- 基于GPT-4生成个性化授权条款
- 支持商业用途、二次创作、署名等多维度配置

### 3. 内容评分系统
- 基于粉丝数、浏览量、点赞数等社交指标
- 智能算法计算内容影响力评分(0-100)
- 不同评分等级获得不同代币奖励

### 4. 智能合约部署
- 集成Story Protocol SDK
- 部署ERC-721授权合约
- 绑定授权条款与版权证明

### 5. 数据库集成
- 用户钱包地址管理
- IP资产完整生命周期跟踪
- 社交媒体账号连接记录
- 授权许可证管理

## 🛠 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui + Radix UI
- **Web3**: RainbowKit + Wagmi + Viem
- **数据库**: Supabase (PostgreSQL)
- **区块链**: Story Protocol + Base Sepolia
- **AI**: OpenAI GPT-4 API
- **存储**: IPFS (Pinata)

## 📚 文档

所有项目文档都在 `/md` 文件夹中：

- **[开发指南](md/DEVELOPMENT.md)** - 详细的开发和部署说明
- **[环境配置](md/ENV_SETUP.md)** - 环境变量配置指南
- **[Supabase配置](md/SUPABASE_SETUP.md)** - 数据库设置指南
- **[设计文档](md/desgin.md)** - 项目设计规范
- **[开发待办](md/TODO.md)** - 项目任务列表
- **[主题修复记录](md/BACKGROUND_THEME_FIXED.md)** - 主题相关修复
- **[数据库集成总结](md/DATABASE_INTEGRATION_SUMMARY.md)** - 数据库功能说明

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone [project-url]
cd ai-creator-protocol
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
参考 [环境配置文档](md/ENV_SETUP.md) 设置所需的API密钥

### 4. 数据库配置
参考 [Supabase配置指南](md/SUPABASE_SETUP.md) 设置数据库

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 📱 使用流程

1. **连接钱包** - 使用RainbowKit连接Web3钱包
2. **上传内容** - 选择文件上传或输入社交媒体链接
3. **AI问答** - 通过7个智能问题设置授权偏好
4. **预览确认** - 查看AI生成的授权条款和奖励信息
5. **部署合约** - 一键部署到区块链并获得代币奖励
6. **完成确权** - 获得不可篡改的版权证明

## 🎯 MVP功能演示

### 内容评分算法
```typescript
// 示例：社交媒体指标
const metrics = {
  followers: 50000,
  views: 120000, 
  likes: 8500,
  comments: 320,
  shares: 180,
  platform: 'tiktok'
}

// 计算影响力评分
const score = ContentScorer.calculateScore(metrics); // 输出: 75
const reward = ContentScorer.getRewardAmount(score); // 输出: 100 代币
```

### AI授权助手示例
```typescript
// 用户偏好
const answers = {
  content_type: '原创摄影',
  commercial_use: '需要付费授权',
  derivatives: '仅允许非商业用途',
  attribution: '必须署名',
  territory: ['全球'],
  channels: ['社交媒体', '网站博客'],
  timeframe: '3年'
}

// AI生成授权条款
const licenseTerms = await ai.generateLicenseTerms(answers);
```

## 🏗 项目结构

```
src/
├── app/                    # Next.js 13 App Router
│   ├── page.tsx           # 首页
│   ├── upload/            # 内容上传页
│   ├── license/           # 授权设置页  
│   ├── success/           # 成功页面
│   └── layout.tsx         # 根布局
├── components/            # React组件
│   └── ui/               # shadcn/ui组件
├── lib/                  # 工具函数
│   ├── ai-assistant.ts   # AI授权助手
│   ├── scoring.ts        # 内容评分算法
│   └── utils.ts          # 通用工具
└── types/                # TypeScript类型定义
    └── index.ts
```


## 📈 后续规划

- [ ] 集成真实的Story Protocol SDK
- [ ] 添加社交媒体API集成（抖音、小红书等）
- [ ] 实现IPFS文件存储
- [ ] 添加用户仪表板和资产管理
- [ ] 支持更多区块链网络
- [ ] 添加内容市场和交易功能
- [ ] 实现版税分配机制

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送到分支: `git push origin feature/AmazingFeature`
5. 打开Pull Request

## 📄 许可证

本项目采用MIT许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Story Protocol](https://storyprotocol.xyz/) - IP基础设施
- [RainbowKit](https://rainbowkit.com/) - Web3钱包连接
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [OpenAI](https://openai.com/) - AI能力支持

---

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**