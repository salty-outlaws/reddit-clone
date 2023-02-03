import { Inter } from '@next/font/google'
import { useUser } from '@supabase/auth-helpers-react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const user = useUser()
  return <div>Hello {user?user.email:""}</div>
}
