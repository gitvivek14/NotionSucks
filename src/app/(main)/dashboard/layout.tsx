import React from 'react'
import { SubscriptionModalProvider } from '@/lib/providers/subscription-modal-provider';

interface LayoutProps{
  children:React.ReactNode;
  params:any
}

const Layout:React.FC<LayoutProps> = ({children,params}) => {
  return (
    <main className='flex over-hidden h-screen'>
      {children}
    </main>
  )
}

export default Layout