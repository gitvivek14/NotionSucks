"use client"
import React,{useState} from 'react';
import { Price, ProductWirhPrice } from '@/lib/supabase/supabase.types';
import { useSubscriptionModal } from '@/lib/providers/subscription-modal-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { Button } from '../ui/button';
import {postData } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
interface SubscriptionModalProps {
  products: ProductWirhPrice[];
}

const SubscriptionModal:React.FC<SubscriptionModalProps>  = (
  {products}
) => {
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const { subscription } = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseUser();
  return (
    <div>SubscriptionModal</div>
  )
}
export default SubscriptionModal