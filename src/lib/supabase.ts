import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查是否为演示环境
const isDemoMode = supabaseUrl?.includes('demo-project') || supabaseAnonKey?.includes('demo-anon-key')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

if (isDemoMode) {
  console.warn('⚠️ 当前使用演示配置，某些功能可能无法正常工作。请配置真实的Supabase项目。')
}

// 创建一个模拟客户端用于演示模式
const createMockClient = () => {
  return {
    auth: {
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: '演示模式：请配置真实的Supabase项目' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: '演示模式：请配置真实的Supabase项目' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: '演示模式：请配置真实的Supabase项目' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: '演示模式：请配置真实的Supabase项目' } }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: '演示模式：请配置真实的Supabase项目' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: '演示模式：请配置真实的Supabase项目' } })
      }),
      upsert: () => Promise.resolve({ data: null, error: { message: '演示模式：请配置真实的Supabase项目' } })
    })
  }
}

export const supabase = isDemoMode ? createMockClient() : createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          updated_at?: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          progress: number
          completed: boolean
          last_accessed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          progress?: number
          completed?: boolean
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          progress?: number
          completed?: boolean
          last_accessed?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          content?: string
          updated_at?: string
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']