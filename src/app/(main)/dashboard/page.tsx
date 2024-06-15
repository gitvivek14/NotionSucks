import React, { use } from 'react'
import db from '@/lib/supabase/db'
import { redirect } from 'next/navigation'
import {createServerClient,type CookieOptions} from "@supabase/ssr"
import { cookies } from 'next/headers'
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'
import DashBoardSetup from '@/components/dashboard-setup/dashboard-setup'

const DashBoard = async () => {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
            }
          },
        },
      }
)
const {data:{user}} = await supabase.auth.getUser();
if(!user) return;
const workspace = await db.query.workspaces.findFirst({
  where : (workspace,{eq})=>eq(workspace.workspaceOwner,user.id)
});
const {data:subscription,error:subscriptionError} = await getUserSubscriptionStatus(user.id)
if(subscriptionError) return;
if(!workspace)
  return (
    <div className='bg-background h-screen w-screen
     flex justify-center
      items-center'>
        <DashBoardSetup user={user} subscription={subscription}/>
        </div>
  )
  redirect(`/dashboard/${workspace.id}`)
}

export default DashBoard