import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

// Story Protocol 配置
const STORY_PROTOCOL_CONFIG = {
  // 测试网络配置 (Story Testnet - Iliad)
  testnet: {
    chainId: 1513, // Story Testnet (Iliad) 链ID
    rpcUrl: "https://testnet.storyrpc.io",
    apiKey: "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U", // 公共API密钥
  },
  // 主网配置 (Story Mainnet)
  mainnet: {
    chainId: 1516, // Story主网链ID
    rpcUrl: "https://rpc.story.foundation",
    apiKey: process.env.STORY_PROTOCOL_API_KEY || "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
  }
};

// 根据环境选择配置
const isDevelopment = process.env.NODE_ENV === 'development';
const config = isDevelopment ? STORY_PROTOCOL_CONFIG.testnet : STORY_PROTOCOL_CONFIG.mainnet;

// 创建Story Protocol客户端
export function createStoryClient(privateKey?: string): StoryClient | null {
  try {
    // 在生产构建时跳过客户端创建，避免配置错误
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return null;
    }

    let clientConfig: any = {
      transport: http(config.rpcUrl),
      chainId: config.chainId as any, // 使用类型断言解决链ID类型问题
    };

    // 如果提供了私钥，添加账户配置
    if (privateKey) {
      const account: Account = privateKeyToAccount(privateKey as Address);
      clientConfig.account = account;
    }

    return StoryClient.newClient(clientConfig as StoryConfig);
  } catch (error) {
    console.warn('Story Protocol client initialization failed:', error);
    return null;
  }
}

// 默认客户端实例（只读）
export const storyClient = createStoryClient();

// 导出配置常量
export { STORY_PROTOCOL_CONFIG };

// 类型定义
export interface IPAssetRegisterParams {
  nftContract: string;
  tokenId: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface LicenseTermsParams {
  transferable: boolean;
  royaltyPolicy?: string;
  mintingFee?: bigint;
  expiration?: bigint;
  commercialUse: boolean;
  commercialAttribution: boolean;
  commercializerChecker?: string;
  commercializerCheckerData?: string;
  commercialRevShare?: number;
  derivativesAllowed: boolean;
  derivativesAttribution: boolean;
  derivativesApproval: boolean;
  derivativesReciprocal: boolean;
  derivativeRevShare?: number;
}