
"use client"
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import {SubmitHandler, useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { FormSchema } from '@/lib/types'
import { actionLoginUser } from '@/lib/server-action/aurh-actions'
import Logo from '../../../../public/cypresslogo.svg';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const LoginPage = () => {
    const router = useRouter()
    const [submitError, setSubmitError] = useState('');
    const form = useForm<z.infer<typeof FormSchema>>({
        mode:'onChange',
        resolver:zodResolver(FormSchema),
        defaultValues:{email:"",password:""}
    })

    const isloading = form.formState.isSubmitting

    const onsubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (FormData)=>{
      const {error} = await actionLoginUser(FormData);
      if(error){
        form.reset();
        setSubmitError(error.message)
      }else{
        router.replace('/dashboard')
      }
     
    }
  return (
    <Form {...form}>
     <form
        onChange={() => {
          if (submitError) setSubmitError('');
        }}
        onSubmit={form.handleSubmit(onsubmit)}
        className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
      >
       
       <Link
          href="/"
          className="
          w-full
          flex
          justify-left
          items-center"
        >
          <Image src={Logo} alt='logo' width={50} height={50}>
          </Image>
          <span
            className="font-semibold
          dark:text-white text-4xl first-letter:ml-2"
          >
            cypress.
          </span>
          </Link>
          <FormDescription className='text-foreground/60'>
          An all-In-One Collaboration and Productivity Platform
          </FormDescription>
          <FormField
          disabled={isloading}
          control={form.control}
          name="email"
          render={({field})=>(
            <FormItem>
              <FormControl>
                <Input type='email' placeholder='email' {...field}>
                </Input>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />
           <FormField
          disabled={isloading}
          control={form.control}
          name="password"
          render={({field})=>(
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='Password' {...field}>
                </Input>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />
          {submitError && <FormMessage>{submitError}</FormMessage>}
          <Button
          type='submit'
          className='w-full p-6'
          size='lg'
          disabled={isloading}
          >
            {!isloading ? 'Login' : "No Login"}
          </Button>
          <span className="self-container">
          Dont have an account?{' '}
          <Link
            href="/signup"
            className="text-primary"
          >
            Sign Up
          </Link>
        </span>
      </form>
    </Form>
  )
}


export default LoginPage