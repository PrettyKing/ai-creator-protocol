import { NextRequest, NextResponse } from 'next/server'
import pinataSDK from '@pinata/sdk'

// Pinata 客户端可能在构建时不可用
let pinata: any = null;

try {
  if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
    pinata = new pinataSDK({
      pinataApiKey: process.env.PINATA_API_KEY,
      pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
    });
  }
} catch (error) {
  console.warn('Pinata API Keys not available during build');
}

export async function POST(request: NextRequest) {
  try {
    // 运行时检查Pinata客户端是否可用
    if (!pinata) {
      if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
        pinata = new pinataSDK({
          pinataApiKey: process.env.PINATA_API_KEY,
          pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
        });
      } else {
        return NextResponse.json(
          { error: 'IPFS服务配置不可用' },
          { status: 503 }
        );
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      )
    }

    // 转换File为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 创建可读流
    const stream = Buffer.from(buffer)

    // 上传到IPFS
    const options = {
      pinataMetadata: {
        name: title || file.name,
      },
      pinataOptions: {
        cidVersion: 1 as const,
      },
    }

    const result = await pinata.pinFileToIPFS(stream, options)

    // 添加元数据
    const metadata = {
      name: title || file.name,
      description: description || '',
      image: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      external_url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      attributes: [
        {
          trait_type: 'File Type',
          value: file.type
        },
        {
          trait_type: 'File Size',
          value: file.size
        },
        {
          trait_type: 'Upload Date',
          value: new Date().toISOString()
        }
      ]
    }

    // 上传元数据到IPFS
    const metadataResult = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `${title || file.name} - Metadata`,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        fileHash: result.IpfsHash,
        fileUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        metadataHash: metadataResult.IpfsHash,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    })

  } catch (error) {
    console.error('IPFS上传错误:', error)
    return NextResponse.json(
      { error: 'IPFS上传失败' },
      { status: 500 }
    )
  }
}