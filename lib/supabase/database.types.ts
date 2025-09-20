export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          created_at?: string
          updated_at?: string
        }
      }
      ip_assets: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          file_url: string
          ipfs_hash: string
          ip_id: string | null
          license_terms: Json | null
          status: 'pending' | 'registered' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          file_url: string
          ipfs_hash: string
          ip_id?: string | null
          license_terms?: Json | null
          status?: 'pending' | 'registered' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          file_url?: string
          ipfs_hash?: string
          ip_id?: string | null
          license_terms?: Json | null
          status?: 'pending' | 'registered' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      social_integrations: {
        Row: {
          id: string
          user_id: string
          platform: 'tiktok' | 'instagram' | 'xiaohongshu' | 'youtube'
          account_id: string
          account_name: string
          metrics: Json
          connected_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'tiktok' | 'instagram' | 'xiaohongshu' | 'youtube'
          account_id: string
          account_name: string
          metrics?: Json
          connected_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'tiktok' | 'instagram' | 'xiaohongshu' | 'youtube'
          account_id?: string
          account_name?: string
          metrics?: Json
          connected_at?: string
          updated_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          asset_id: string
          licensee_id: string | null
          license_type: string
          terms: Json
          price: number | null
          royalty_percentage: number | null
          transaction_hash: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          licensee_id?: string | null
          license_type: string
          terms: Json
          price?: number | null
          royalty_percentage?: number | null
          transaction_hash?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          licensee_id?: string | null
          license_type?: string
          terms?: Json
          price?: number | null
          royalty_percentage?: number | null
          transaction_hash?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}