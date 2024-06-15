import React from 'react'
import { useAppState } from '@/lib/providers/state-provider';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {createClient} from "@/lib/supabase/client"
interface LogoutButtonProps {
    children: React.ReactNode;
  }
const LogoutButton:React.FC<LogoutButtonProps> = (
    {children}
) => {
    const { user } = useSupabaseUser();
    const { dispatch } = useAppState();
    const router = useRouter();
    const supabase = createClient()
    const logout  = async()=>{
        await supabase.auth.signOut()
        router.refresh()
        // dispatch({type:'SET_WORKSPACES',payload:{workspaces:[]}})
    }

  return (
    <Button variant='ghost' size="icon"
    className='p-0'
    onClick={
        logout
    }
    >
        {children}
    </Button>
  )
}

export default LogoutButton