export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  skills: string[] | null
  created_at: string
  updated_at: string
}

export interface CashflowTableSettings {
  showPresentValue: boolean
  defaultSortColumn: string
  defaultSortDirection: 'asc' | 'desc'
}

export interface MatrixTableSettings {
  defaultView: 'yield' | 'price' | 'spread'
  showSpreadToWorst: boolean
  showYieldToWorst: boolean
}

export interface UserSettings {
  id: string
  decimal_places: number
  default_currency: string
  default_return_metric: ReturnMetricType
  show_grid_lines: boolean
  dark_mode: boolean
  compact_mode: boolean
  day_count_convention: string
  settlement_days: number
  price_decimal_places: number
  yield_decimal_places: number
  spread_decimal_places: number
  cashflow_table_settings: CashflowTableSettings
  matrix_table_settings: MatrixTableSettings
  created_at: string
  updated_at: string
}

export type FocusArea =
  | 'credit_research'
  | 'portfolio_management'
  | 'trading'
  | 'risk_management'
  | 'quantitative_analysis'
  | 'investment_banking'
  | 'sales_and_trading'

export type AssetClass =
  | 'investment_grade'
  | 'high_yield'
  | 'leveraged_loans'
  | 'structured_products'
  | 'municipal_bonds'
  | 'sovereign_debt'
  | 'emerging_markets'
  | 'convertibles'

export type ReturnMetricType =
  | 'yield_percent'
  | 'spread_bps'
  | 'price'
  | 'dollar_price'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      user_settings: {
        Row: UserSettings
        Insert: Omit<UserSettings, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      focus_area: FocusArea
      asset_class: AssetClass
      return_metric_type: ReturnMetricType
    }
  }
}
