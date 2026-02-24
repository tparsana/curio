import { createClient } from "@supabase/supabase-js"

// Types for our database
export type Database = {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string
          user_id: string
          youtube_id: string
          title: string
          thumbnail: string
          status: "up_next" | "watched" | "not_interested"
          priority: "high" | "medium" | "low" | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          youtube_id: string
          title: string
          thumbnail: string
          status?: "up_next" | "watched" | "not_interested"
          priority?: "high" | "medium" | "low" | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          youtube_id?: string
          title?: string
          thumbnail?: string
          status?: "up_next" | "watched" | "not_interested"
          priority?: "high" | "medium" | "low" | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      video_tags: {
        Row: {
          id: string
          video_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
    Enums: {
      video_status: "up_next" | "watched" | "not_interested"
      priority_level: "high" | "medium" | "low"
    }
  }
}

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton pattern for the client-side Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}
