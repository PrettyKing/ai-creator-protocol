export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          last_login?: string | null
        }
        Relationships: []
      }
      ip_assets: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string | null
          creator_address: string
          content_type: string | null
          content_hash: string | null
          metadata_hash: string | null
          social_url: string | null
          social_metrics: Json | null
          content_score: number | null
          grade: string | null
          tx_hash: string | null
          contract_address: string | null
          token_id: string | null
          ip_asset_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id?: string | null
          creator_address: string
          content_type?: string | null
          content_hash?: string | null
          metadata_hash?: string | null
          social_url?: string | null
          social_metrics?: Json | null
          content_score?: number | null
          grade?: string | null
          tx_hash?: string | null
          contract_address?: string | null
          token_id?: string | null
          ip_asset_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string | null
          creator_address?: string
          content_type?: string | null
          content_hash?: string | null
          metadata_hash?: string | null
          social_url?: string | null
          social_metrics?: Json | null
          content_score?: number | null
          grade?: string | null
          tx_hash?: string | null
          contract_address?: string | null
          token_id?: string | null
          ip_asset_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ip_assets_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      license_terms: {
        Row: {
          id: string
          ip_asset_id: string
          commercial_use: boolean
          derivatives: boolean
          attribution: boolean
          share_alike: boolean
          territory: string[]
          channels: string[]
          timeframe: number | null
          royalty: number | null
          created_at: string
        }
        Insert: {
          id?: string
          ip_asset_id: string
          commercial_use?: boolean
          derivatives?: boolean
          attribution?: boolean
          share_alike?: boolean
          territory?: string[]
          channels?: string[]
          timeframe?: number | null
          royalty?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          ip_asset_id?: string
          commercial_use?: boolean
          derivatives?: boolean
          attribution?: boolean
          share_alike?: boolean
          territory?: string[]
          channels?: string[]
          timeframe?: number | null
          royalty?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_terms_ip_asset_id_fkey"
            columns: ["ip_asset_id"]
            isOneToOne: true
            referencedRelation: "ip_assets"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          ip_asset_id: string | null
          from_address: string | null
          to_address: string | null
          tx_hash: string
          tx_type: string | null
          amount: number | null
          gas_used: number | null
          gas_price: number | null
          block_number: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          ip_asset_id?: string | null
          from_address?: string | null
          to_address?: string | null
          tx_hash: string
          tx_type?: string | null
          amount?: number | null
          gas_used?: number | null
          gas_price?: number | null
          block_number?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          ip_asset_id?: string | null
          from_address?: string | null
          to_address?: string | null
          tx_hash?: string
          tx_type?: string | null
          amount?: number | null
          gas_used?: number | null
          gas_price?: number | null
          block_number?: number | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_ip_asset_id_fkey"
            columns: ["ip_asset_id"]
            isOneToOne: false
            referencedRelation: "ip_assets"
            referencedColumns: ["id"]
          }
        ]
      }
      earnings: {
        Row: {
          id: string
          user_id: string
          ip_asset_id: string | null
          amount: number
          token_symbol: string
          source: string | null
          tx_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ip_asset_id?: string | null
          amount: number
          token_symbol?: string
          source?: string | null
          tx_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ip_asset_id?: string | null
          amount?: number
          token_symbol?: string
          source?: string | null
          tx_hash?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_ip_asset_id_fkey"
            columns: ["ip_asset_id"]
            isOneToOne: false
            referencedRelation: "ip_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}