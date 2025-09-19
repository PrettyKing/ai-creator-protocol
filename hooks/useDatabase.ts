import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { createClient } from '@/lib/supabase/client'
import type { User, IPAsset, SocialIntegration, License } from '@/lib/supabase/types'

export function useUser() {
  const { address } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const createOrFetchUser = useCallback(async () => {
    if (!address) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/users?wallet=${address}`)

      if (!response.ok) {
        const createResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address })
        })

        if (!createResponse.ok) throw new Error('Failed to create user')

        const { user: newUser } = await createResponse.json()
        setUser(newUser)
      } else {
        const { user: existingUser } = await response.json()
        setUser(existingUser)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    createOrFetchUser()
  }, [createOrFetchUser])

  return { user, loading, error, refetch: createOrFetchUser }
}

export function useAssets(userId?: string) {
  const [assets, setAssets] = useState<IPAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      const params = userId ? `?userId=${userId}` : ''
      const response = await fetch(`/api/assets${params}`)

      if (!response.ok) throw new Error('Failed to fetch assets')

      const { assets: fetchedAssets } = await response.json()
      setAssets(fetchedAssets)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const createAsset = async (assetData: Omit<IPAsset, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      })

      if (!response.ok) throw new Error('Failed to create asset')

      const { asset } = await response.json()
      setAssets(prev => [asset, ...prev])
      return asset
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error')
    }
  }

  const updateAsset = async (id: string, updateData: Partial<IPAsset>) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      if (!response.ok) throw new Error('Failed to update asset')

      const { asset } = await response.json()
      setAssets(prev => prev.map(a => a.id === id ? asset : a))
      return asset
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error')
    }
  }

  return { assets, loading, error, refetch: fetchAssets, createAsset, updateAsset }
}

export function useSocialIntegrations(userId?: string) {
  const [integrations, setIntegrations] = useState<SocialIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchIntegrations = useCallback(async () => {
    if (!userId) {
      setIntegrations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/social?userId=${userId}`)

      if (!response.ok) throw new Error('Failed to fetch social integrations')

      const { integrations: fetchedIntegrations } = await response.json()
      setIntegrations(fetchedIntegrations)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  const createIntegration = async (integrationData: Omit<SocialIntegration, 'id' | 'connected_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationData)
      })

      if (!response.ok) throw new Error('Failed to create integration')

      const { integration } = await response.json()
      setIntegrations(prev => [...prev, integration])
      return integration
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error')
    }
  }

  const updateMetrics = async (id: string, metrics: any) => {
    try {
      const response = await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, metrics })
      })

      if (!response.ok) throw new Error('Failed to update metrics')

      const { integration } = await response.json()
      setIntegrations(prev => prev.map(i => i.id === id ? integration : i))
      return integration
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error')
    }
  }

  return { integrations, loading, error, refetch: fetchIntegrations, createIntegration, updateMetrics }
}

export function useLicenses(assetId?: string, licenseeId?: string) {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLicenses = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (assetId) params.append('assetId', assetId)
      if (licenseeId) params.append('licenseeId', licenseeId)

      const response = await fetch(`/api/licenses?${params}`)

      if (!response.ok) throw new Error('Failed to fetch licenses')

      const { licenses: fetchedLicenses } = await response.json()
      setLicenses(fetchedLicenses)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [assetId, licenseeId])

  useEffect(() => {
    if (assetId || licenseeId) {
      fetchLicenses()
    }
  }, [fetchLicenses, assetId, licenseeId])

  const createLicense = async (licenseData: Omit<License, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(licenseData)
      })

      if (!response.ok) throw new Error('Failed to create license')

      const { license } = await response.json()
      setLicenses(prev => [license, ...prev])
      return license
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error')
    }
  }

  return { licenses, loading, error, refetch: fetchLicenses, createLicense }
}