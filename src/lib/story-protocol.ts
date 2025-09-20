import { LicenseTerms } from '@/types'
import {
  StoryProtocolService,
  registerIPAsset as registerIPAssetService,
  createLicenseTerms as createLicenseTermsService,
  attachLicenseTerms as attachLicenseTermsService
} from '../../lib/story-protocol/service'
import type { IPAssetRegisterParams, LicenseTermsParams } from '../../lib/story-protocol/client'

// Story Protocol配置
export const STORY_CONFIG = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 11155111,
  rpcUrl: process.env.STORY_PROTOCOL_RPC_URL || 'https://rpc.aeneid.storyrpc.io',
  apiKey: process.env.STORY_PROTOCOL_API_KEY || 'MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U'
}

// IP资产注册数据结构
export interface IPAssetData {
  title: string
  description: string
  contentHash: string // IPFS hash
  metadataHash: string // IPFS metadata hash
  creator: string // 钱包地址
  licenseTerms: LicenseTerms
}

// Story Protocol SDK封装类
export class StoryProtocolSDK {
  private config: typeof STORY_CONFIG

  constructor(config?: Partial<typeof STORY_CONFIG>) {
    this.config = { ...STORY_CONFIG, ...config }
  }

  // 注册IP资产
  async registerIPAsset(data: IPAssetData, walletClient?: any): Promise<{
    success: boolean
    txHash?: string
    ipAssetId?: string
    tokenId?: string
    contractAddress?: string
    error?: string
  }> {
    try {
      // 1. 验证输入数据
      if (!data.title || !data.contentHash || !data.creator) {
        throw new Error('缺少必要的注册信息')
      }

      // 2. 准备IP资产注册参数
      const registerParams: IPAssetRegisterParams = {
        nftContract: '0x0000000000000000000000000000000000000000', // 需要实际的NFT合约地址
        tokenId: Math.floor(Math.random() * 10000).toString(), // 临时生成tokenId
        metadata: {
          name: data.title,
          description: data.description || '',
          image: `https://gateway.pinata.cloud/ipfs/${data.contentHash}`,
          attributes: [
            { trait_type: 'Creator', value: data.creator },
            { trait_type: 'Content Hash', value: data.contentHash },
            { trait_type: 'Metadata Hash', value: data.metadataHash }
          ]
        }
      }

      console.log('正在向Story Protocol注册IP资产...', registerParams)

      // 3. 调用真实的Story Protocol SDK
      const result = await registerIPAssetService(registerParams)

      if (result.success) {
        return {
          success: true,
          txHash: result.txHash,
          ipAssetId: result.ipId,
          tokenId: result.tokenId?.toString(),
          contractAddress: registerParams.nftContract
        }
      } else {
        // SDK调用失败，在开发环境使用模拟数据
        if (process.env.NODE_ENV === 'development') {
          console.warn('Story Protocol SDK调用失败，使用模拟数据:', result.error)
          const mockResponse = {
            success: true,
            txHash: '0x' + Array.from({length: 64}, () =>
              Math.floor(Math.random() * 16).toString(16)).join(''),
            ipAssetId: `ip_${Date.now()}`,
            tokenId: Math.floor(Math.random() * 10000).toString(),
            contractAddress: '0x' + Array.from({length: 40}, () =>
              Math.floor(Math.random() * 16).toString(16)).join('')
          }
          return mockResponse
        }

        return {
          success: false,
          error: result.error
        }
      }

    } catch (error) {
      console.error('IP资产注册失败:', error)

      // 如果是开发环境，返回模拟数据以便测试
      if (process.env.NODE_ENV === 'development') {
        console.warn('开发环境：使用模拟数据')
        const mockTxHash = '0x' + Array.from({length: 64}, () =>
          Math.floor(Math.random() * 16).toString(16)).join('')

        const mockTokenId = Math.floor(Math.random() * 10000).toString()
        const mockContractAddress = '0x' + Array.from({length: 40}, () =>
          Math.floor(Math.random() * 16).toString(16)).join('')

        return {
          success: true,
          txHash: mockTxHash,
          ipAssetId: `ip_${mockTokenId}`,
          tokenId: mockTokenId,
          contractAddress: mockContractAddress
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '注册失败'
      }
    }
  }

  // 创建许可条款
  async createLicenseTerms(terms: LicenseTerms): Promise<{
    success: boolean
    licenseId?: string
    error?: string
  }> {
    try {
      // 将许可条款转换为Story Protocol格式
      const licenseParams: LicenseTermsParams = {
        transferable: true,
        commercialUse: terms.commercialUse,
        commercialAttribution: terms.attribution,
        commercialRevShare: terms.royalty || 0,
        derivativesAllowed: terms.derivatives,
        derivativesAttribution: terms.attribution,
        derivativesApproval: false,
        derivativesReciprocal: terms.shareAlike || false,
        derivativeRevShare: terms.royalty || 0,
        expiration: terms.timeframe ? BigInt(Date.now() + terms.timeframe * 30 * 24 * 60 * 60 * 1000) : BigInt(0), // 转换月份为毫秒
      }

      console.log('正在创建Story Protocol许可条款...', licenseParams)

      // 调用真实的Story Protocol SDK
      const result = await createLicenseTermsService(licenseParams)

      if (result.success) {
        return {
          success: true,
          licenseId: result.licenseTermsId?.toString()
        }
      } else {
        // SDK调用失败，在开发环境使用模拟数据
        if (process.env.NODE_ENV === 'development') {
          console.warn('Story Protocol许可条款创建失败，使用模拟数据:', result.error)
          return {
            success: true,
            licenseId: 'license_' + Date.now()
          }
        }

        return {
          success: false,
          error: result.error
        }
      }

    } catch (error) {
      console.error('许可条款创建失败:', error)

      // 开发环境返回模拟数据
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          licenseId: 'license_' + Date.now()
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '许可条款创建失败'
      }
    }
  }

  // 设置版税分配
  async setRoyalties(ipAssetId: string, royaltyPercentage: number): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      if (royaltyPercentage < 0 || royaltyPercentage > 100) {
        throw new Error('版税比例必须在0-100之间')
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      // 在实际实现中，这里会设置版税分配智能合约

      return { success: true }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '版税设置失败'
      }
    }
  }

  // 获取IP资产信息
  async getIPAssetInfo(ipAssetId: string): Promise<{
    success: boolean
    data?: {
      title: string
      creator: string
      licenseTerms: LicenseTerms
      royaltyPercentage: number
      createdAt: string
    }
    error?: string
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟返回IP资产信息
      return {
        success: true,
        data: {
          title: '示例IP资产',
          creator: '0x1234...5678',
          licenseTerms: {
            commercialUse: true,
            derivatives: true,
            attribution: true,
            shareAlike: false,
            territory: ['全球'],
            channels: ['社交媒体', '网站博客'],
            timeframe: 36,
            royalty: 10
          },
          royaltyPercentage: 10,
          createdAt: new Date().toISOString()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取信息失败'
      }
    }
  }
}

// 工具函数：将许可条款转换为链上格式
export function licenseTermsToChainFormat(terms: LicenseTerms) {
  return {
    // 将用户友好的条款转换为智能合约参数格式
    commercialUse: terms.commercialUse,
    derivatives: terms.derivatives,
    attribution: terms.attribution,
    shareAlike: terms.shareAlike,
    territory: terms.territory.join(','),
    channels: terms.channels.join(','),
    timeframe: terms.timeframe,
    royalty: Math.floor((terms.royalty || 0) * 100) // 转换为基点
  }
}

// 工具函数：估算Gas费用
export async function estimateGasCost(operation: 'register' | 'license' | 'royalty'): Promise<{
  gasLimit: number
  gasPrice: string
  estimatedCost: string
}> {
  // 模拟Gas估算
  const gasLimits = {
    register: 300000,
    license: 150000,
    royalty: 100000
  }

  return {
    gasLimit: gasLimits[operation],
    gasPrice: '20000000000', // 20 Gwei
    estimatedCost: '0.006' // ETH
  }
}