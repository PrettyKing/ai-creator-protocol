# Story Protocol SDK 配置指南

## 📚 Story Protocol 简介

Story Protocol 是一个用于知识产权(IP)资产管理的区块链协议，提供TypeScript SDK来简化开发。

## 🔧 SDK安装和配置

### 1. 安装依赖
```bash
npm install @story-protocol/core-sdk viem
```

### 2. 基础配置

#### 环境变量配置
在 `.env` 文件中添加：
```env
# Story Protocol 配置
STORY_PROTOCOL_API_KEY=MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U
STORY_PROTOCOL_RPC_URL=https://rpc.odyssey.storyrpc.io
NEXT_PUBLIC_STORY_CHAIN_ID=1516
WALLET_PRIVATE_KEY=your-wallet-private-key-here

# 或使用测试网络
# STORY_PROTOCOL_RPC_URL=https://rpc.aeneid.storyrpc.io
# NEXT_PUBLIC_STORY_CHAIN_ID=aeneid
```

#### SDK客户端配置
创建 `src/lib/story-client.ts`：
```typescript
import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const config: StoryConfig = {
  transport: http(process.env.STORY_PROTOCOL_RPC_URL),
  chainId: process.env.NEXT_PUBLIC_STORY_CHAIN_ID as any,
};

// 如果有私钥，添加账户配置
if (process.env.WALLET_PRIVATE_KEY) {
  const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
  const account: Account = privateKeyToAccount(privateKey);
  config.account = account;
}

export const storyClient = StoryClient.newClient(config);
```

## 🌐 支持的网络

### 测试网络 (推荐开发使用)
- **网络名称**: Aeneid Testnet
- **Chain ID**: aeneid
- **RPC URL**: https://rpc.aeneid.storyrpc.io
- **浏览器**: https://explorer.aeneid.storyrpc.io

### 主网络
- **网络名称**: Story Mainnet
- **Chain ID**: 1516
- **RPC URL**: https://rpc.odyssey.storyrpc.io
- **浏览器**: https://explorer.storyrpc.io

## 🔑 API密钥获取

### 公共API密钥
对于开发和测试，可以使用公共API密钥：
```
MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U
```
- 限制：300请求/秒
- 适用于：开发和MVP测试

### 高级API访问
如需更高的请求限制：
1. 加入 [Builder Discord](https://discord.gg/storyprotocol)
2. 描述你的项目需求
3. 申请专用API密钥

## 📋 核心功能模块

### 1. License Module (许可证模块)
- 创建可定制的许可证条款
- 铸造可转让的许可证代币

### 2. Royalty Module (版税模块)
- 版税声明和管理
- 支付分配

### 3. Dispute Module (争议模块)
- 发起和解决IP相关争议

### 4. Group Module (组模块)
- 创建共享收益池的IP集合

### 5. NFT Client Module (NFT客户端模块)
- 为Story Protocol铸造新的SPG集合

## 🧪 示例代码

### 基本IP资产注册
```typescript
import { storyClient } from '@/lib/story-client';

export async function registerIPAsset(nftAddress: string, tokenId: string) {
  try {
    const response = await storyClient.ipAsset.register({
      nftContract: nftAddress,
      tokenId: tokenId,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24小时后过期
    });

    return {
      success: true,
      ipId: response.ipId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('IP asset registration failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

### 创建许可证条款
```typescript
export async function createLicenseTerms(config: any) {
  try {
    const response = await storyClient.license.registerPILTerms({
      transferable: config.transferable,
      royaltyPolicy: config.royaltyPolicy,
      mintingFee: config.mintingFee,
      expiration: config.expiration,
      commercialUse: config.commercialUse,
      commercialAttribution: config.commercialAttribution,
      commercializerChecker: config.commercializerChecker,
      commercializerCheckerData: config.commercializerCheckerData,
      commercialRevShare: config.commercialRevShare,
      derivativesAllowed: config.derivativesAllowed,
      derivativesAttribution: config.derivativesAttribution,
      derivativesApproval: config.derivativesApproval,
      derivativesReciprocal: config.derivativesReciprocal,
      derivativeRevShare: config.derivativeRevShare,
    });

    return response;
  } catch (error) {
    console.error('License terms creation failed:', error);
    throw error;
  }
}
```

## 🔧 故障排除

### 常见问题

1. **网络连接失败**
   - 检查RPC URL是否正确
   - 确认网络连接稳定

2. **认证失败**
   - 验证API密钥格式
   - 检查私钥配置

3. **交易失败**
   - 确认钱包有足够的gas费
   - 检查网络是否拥堵

### 调试建议
```typescript
// 启用详细日志
const client = StoryClient.newClient({
  ...config,
  debug: true,
});
```

## 📖 更多资源

- [官方文档](https://docs.story.foundation/)
- [GitHub SDK](https://github.com/storyprotocol/sdk)
- [示例项目](https://github.com/storyprotocol/my-story-protocol-example)
- [Discord社区](https://discord.gg/storyprotocol)

## 🚀 下一步

1. 安装SDK依赖
2. 配置环境变量
3. 创建客户端配置
4. 测试基本功能
5. 集成到应用中