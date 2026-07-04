"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"

type AuthRedirectProps = {
  to?: string
}

export function AuthRedirect({ to = "/app" }: AuthRedirectProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(to)
    }
  }, [isLoading, router, to, user])

  return null
}
