
import {createServerClient, type CookieOptions} from "@supabase/ssr"
import { NextRequest,NextResponse } from "next/server"
import { cookies } from 'next/headers'
export async function GET(req:NextRequest){
    const cookieStore = cookies()
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get('ConfirmationURL')
    console.log("printing code",code);
    if(code){
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
        await supabase.auth.exchangeCodeForSession(code)
    }else{
        console.log("print no code");
    }
    return NextResponse.redirect(`http://localhost:3000/dashboard`)
}