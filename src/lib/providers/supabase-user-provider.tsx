'use client'
import { AuthUser } from '@supabase/supabase-js';
import { Subscription } from '../supabase/supabase.types';
import { createContext, useContext, useEffect, useState } from 'react';
import { getUserSubscriptionStatus } from '../supabase/queries';
import { useToast } from '@/components/ui/use-toast';
import {createClient} from "../supabase/client"
import React from 'react'


interface SupabaseUserContextType{
  user:AuthUser | null,
  subscription:Subscription|null
}

const SupabaseUserContext = createContext<SupabaseUserContextType>({
    user:null,
    subscription:null
})
export const useSupabaseUser = ()=>{
    return useContext(SupabaseUserContext)
}
interface SupabaseUserProviderProps {
    children: React.ReactNode;
  }
export const SupabaseUserProvider:React.FC<SupabaseUserProviderProps>  = ({
    children
}) => {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const { toast } = useToast();
    const supabase = createClient()
    useEffect(()=>{
        const getuser = async()=>{
            const{data:{user}} = await supabase.auth.getUser();
            if(user){
                console.log(user);
                setUser(user)
                const {data,error} = await getUserSubscriptionStatus(user.id)
                if(error){
                    toast({
                        title: 'Unexpected Error',
                        description:
                          'Oppse! An unexpected error happened. Try again later.',
                      });
                }
            }
        };
        getuser()
    },[supabase,toast])
  return (
    <SupabaseUserContext.Provider value={{user,subscription}}>
        {children}
    </SupabaseUserContext.Provider>
  )
}

