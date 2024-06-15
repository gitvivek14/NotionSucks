"use client"
import React,{useState} from 'react';
import { Price, ProductWirhPrice } from '@/lib/supabase/supabase.types';

interface SubscriptionModalProps {
  products: ProductWirhPrice[];
}

const SubscriptionModal:React.FC<SubscriptionModalProps>  = (
  {products}
) => {
  return (
    <div>SubscriptionModal</div>
  )
}

export default SubscriptionModal