import { AuthGuard } from "@/components/auth-guard"
import HomeClient from "./home-client"

export default function Home() {
  return (
    <AuthGuard>
      <HomeClient />
    </AuthGuard>
  )
}
