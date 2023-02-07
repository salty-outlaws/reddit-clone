import CreatePostLink from '@/components/community/CreatePostLink'
import PageContent from '@/components/layout/PageContent'
import Posts from '@/components/posts/Posts'
import HomeSidebar from '@/components/sidebars/HomeSidebar'
import { Inter } from '@next/font/google'
import { useUser } from '@supabase/auth-helpers-react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const user = useUser()
  return (
    <PageContent>
      <>
        {/* <CreatePostLink /> */}
        <Posts communityCode={""} homePage={true}/>
      </>
      <>
        <HomeSidebar/>
      </>
    </PageContent>
  )
}
