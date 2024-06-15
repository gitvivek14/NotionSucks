"use client"
import * as React from 'react'
import { ThemeProvider as NextThemeseProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({children,...props}:ThemeProviderProps){
    return <NextThemeseProvider {...props}>
        {children}
    </NextThemeseProvider>
}