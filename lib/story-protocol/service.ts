import { createStoryClient, IPAssetRegisterParams, LicenseTermsParams } from './client';

export class StoryProtocolService {
  private client;

  constructor(privateKey?: string) {
    this.client = createStoryClient(privateKey);
  }

  /**
   * 注册IP资产到Story Protocol
   */
  async registerIPAsset(params: IPAssetRegisterParams) {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Story Protocol client not initialized',
        };
      }

      const { nftContract, tokenId, metadata } = params;

      // 使用Story Protocol SDK注册IP资产
      const response = await this.client.ipAsset.register({
        nftContract: nftContract as `0x${string}`,
        tokenId: BigInt(tokenId),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24小时后过期
        ipMetadata: metadata ? {
          ipMetadataURI: '', // 可以上传到IPFS
          ipMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          nftMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        } : undefined,
      });

      return {
        success: true,
        ipId: response.ipId,
        txHash: response.txHash,
        tokenId: response.tokenId,
        data: response,
      };
    } catch (error: any) {
      console.error('IP asset registration failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to register IP asset',
        details: error,
      };
    }
  }

  /**
   * 创建许可证条款
   */
  async createLicenseTerms(params: LicenseTermsParams) {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Story Protocol client not initialized',
        };
      }
      const response = await this.client.license.registerPILTerms({
        transferable: params.transferable,
        royaltyPolicy: params.royaltyPolicy as `0x${string}` || '0x0000000000000000000000000000000000000000',
        commercialUse: params.commercialUse,
        commercialAttribution: params.commercialAttribution,
        commercializerChecker: params.commercializerChecker as `0x${string}` || '0x0000000000000000000000000000000000000000',
        commercializerCheckerData: (params.commercializerCheckerData || '0x') as `0x${string}`,
        commercialRevShare: params.commercialRevShare || 0,
        derivativesAllowed: params.derivativesAllowed,
        derivativesAttribution: params.derivativesAttribution,
        derivativesApproval: params.derivativesApproval,
        derivativesReciprocal: params.derivativesReciprocal,
        currency: '0x0000000000000000000000000000000000000000' as `0x${string}`, // 默认货币地址
        uri: '', // 许可证URI
        defaultMintingFee: BigInt(0), // 默认铸造费用
        expiration: params.expiration || BigInt(0), // 过期时间
        commercialRevCeiling: BigInt(0), // 商业收入上限
        derivativeRevCeiling: BigInt(0), // 衍生品收入上限
      });

      return {
        success: true,
        licenseTermsId: response.licenseTermsId,
        txHash: response.txHash,
        data: response,
      };
    } catch (error: any) {
      console.error('License terms creation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to create license terms',
        details: error,
      };
    }
  }

  /**
   * 为IP资产附加许可证条款
   */
  async attachLicenseTerms(ipId: string, licenseTermsId: string) {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Story Protocol client not initialized',
        };
      }
      const response = await this.client.license.attachLicenseTerms({
        ipId: ipId as `0x${string}`,
        licenseTermsId: BigInt(licenseTermsId),
      });

      return {
        success: true,
        txHash: response.txHash,
        data: response,
      };
    } catch (error: any) {
      console.error('Attach license terms failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to attach license terms',
        details: error,
      };
    }
  }

  /**
   * 获取IP资产信息 (暂时禁用，等待SDK更新)
   */
  async getIPAsset(ipId: string) {
    try {
      // TODO: 等待Story Protocol SDK添加get方法
      // const response = await this.client.ipAsset.get(ipId as `0x${string}`);

      return {
        success: true,
        data: { ipId, message: 'IP asset info retrieval not yet implemented' },
      };
    } catch (error: any) {
      console.error('Get IP asset failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to get IP asset',
        details: error,
      };
    }
  }

  /**
   * 铸造许可证NFT
   */
  async mintLicense(params: {
    licensorIpId: string;
    licenseTermsId: string;
    amount: number;
    receiver: string;
  }) {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Story Protocol client not initialized',
        };
      }
      const { licensorIpId, licenseTermsId, amount, receiver } = params;

      const response = await this.client.license.mintLicenseTokens({
        licensorIpId: licensorIpId as `0x${string}`,
        licenseTermsId: BigInt(licenseTermsId),
        amount: BigInt(amount),
        receiver: receiver as `0x${string}`,
        maxMintingFee: BigInt(0), // 最大铸造费用
        maxRevenueShare: 0, // 最大收入分享
      });

      return {
        success: true,
        licenseTokenId: response.licenseTokenIds?.[0],
        txHash: response.txHash,
        data: response,
      };
    } catch (error: any) {
      console.error('Mint license failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to mint license',
        details: error,
      };
    }
  }

  /**
   * 检查SDK连接状态
   */
  async checkConnection() {
    try {
      // 简单检查客户端是否已初始化
      const connected = !!this.client;
      return {
        success: true,
        connected,
        message: connected ? 'Story Protocol client initialized' : 'Client not initialized'
      };
    } catch (error: any) {
      return {
        success: false,
        connected: false,
        error: error.message,
      };
    }
  }
}

// 默认服务实例
export const storyProtocolService = new StoryProtocolService();

// 导出便利函数
export const registerIPAsset = (params: IPAssetRegisterParams, privateKey?: string) => {
  const service = privateKey ? new StoryProtocolService(privateKey) : storyProtocolService;
  return service.registerIPAsset(params);
};

export const createLicenseTerms = (params: LicenseTermsParams, privateKey?: string) => {
  const service = privateKey ? new StoryProtocolService(privateKey) : storyProtocolService;
  return service.createLicenseTerms(params);
};

export const attachLicenseTerms = (ipId: string, licenseTermsId: string, privateKey?: string) => {
  const service = privateKey ? new StoryProtocolService(privateKey) : storyProtocolService;
  return service.attachLicenseTerms(ipId, licenseTermsId);
};