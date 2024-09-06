import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

import Sidebar from '@/components/sidebar'
import Loader from '@/components/loader'
import { FirebaseClient } from '@/clients/firebase'
import useIsCollapsed from '@/hooks/use-is-collapsed'

const client = new FirebaseClient()
let isInitialized = false

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isInitialized) {
      onAuthStateChanged(client.getAuth(), (user) => {
        if (!user) {
          navigate('/sign-in')

          return
        }

        navigate('/')

        return
      })

      isInitialized = true
    }
  }, [navigate])

  if (!isInitialized) {
    return (
      <div className='relative h-full overflow-hidden bg-background'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Outlet />
      </main>
    </div>
  )
}
