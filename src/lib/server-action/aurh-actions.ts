import {z} from "zod"
import {createClient} from "@supabase/supabase-js"
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import {createBrowserClient,createServerClient} from "@supabase/ssr"
export async function actionLoginUser({email,password}:
    z.infer<typeof FormSchema>

) {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const response = await supabase.auth.signInWithPassword({
        email,password
    })
    console.log("printing resp",response);
    return response;
}
export async function actionSignUpUser({
    email,
    password,
  }: z.infer<typeof FormSchema>) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    // const { data } = await supabase
    //   .from('profiles')
    //   .select('*')
    //   .eq('email', email);
  
    // if (data?.length) return { error: { message: 'User already exists', data } };
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/api/auth/callback',
      },
    });
    return response;
  }