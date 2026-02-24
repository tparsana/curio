"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          return
        }

        if (data.session) {
          setSession(data.session)
          setUser(data.session.user)
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Login error:", error.message)
      throw error
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      // Sign up the user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Signup error:", error.message)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      router.push("/login")
    } catch (error: any) {
      console.error("Logout error:", error.message)
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
