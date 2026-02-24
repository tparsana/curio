import { AuthGuard } from "@/components/auth-guard"
import HomeClient from "@/app/home-client"

export default function AppPage() {
  return (
    <AuthGuard>
      <HomeClient />
    </AuthGuard>
  )
}
