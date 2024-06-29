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
import { useToast } from '../ui/use-toast';
interface SubscriptionModalProps {
  products: ProductWirhPrice[];
}
import { getStripe } from '@/lib/stripe/stripeClient';
import { formatPrice, postData } from '@/lib/utils';
import { Button } from '../ui/button';
import Loader from './Loader';

const SubscriptionModal:React.FC<SubscriptionModalProps>  = (
  {products}
) => {
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const { subscription } = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseUser();

  const onClickContinue= async(price:Price)=>{
    try {
      setIsLoading(true)
      if(!user){
        toast({ title: 'You must be logged in' });
        setIsLoading(false);
        return;
      }
      if(subscription){
        toast({ title: 'Already on a paid plan' });
        setIsLoading(false);
        return;
      }
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({sessionId});
    } catch (error) {
      toast({ title: 'Oppse! Something went wrong.', variant: 'destructive' });
    }
    setIsLoading(false)
  }
  return (
    <Dialog
    open={open}
    onOpenChange={setOpen}
    >
      {subscription?.status==='active' ? (
       <DialogContent>Already on a paid plan!</DialogContent>
      ): (
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to a Pro Plan</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          To access Pro features you need to have a paid plan.
        </DialogDescription>
        {
          products.map((product)=>(
            <div key={product.id}
            className="
            flex
            justify-between
            items-center
            "
            >
               {product.prices?.map((price) => (
                    <React.Fragment key={price.id}>
                      <b className="text-3xl text-foreground">
                        {formatPrice(price)} / <small>{price.interval}</small>
                      </b>
                      <Button
                        onClick={() => onClickContinue(price)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : 'Upgrade ✨'}
                      </Button>
                    </React.Fragment>
                  ))}
            </div>
          ))
        }
        </DialogContent>
      )}

    </Dialog>
  )
}
export default SubscriptionModal