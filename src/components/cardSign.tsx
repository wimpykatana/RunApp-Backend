"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from 'react'
import SigninGoogle from "./googleSignIn";

interface CardSignProps {
    submintFormFunc: (email:string, password:string) => void
    isSignUp?: boolean
}

const CardSign = ({
    submintFormFunc,
    isSignUp = false
}:CardSignProps) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(isSignUp && password !== rePassword){
            alert('Passwords do not match')
            return
        }
        submintFormFunc(email, password)
    }

  return (
    <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder='Password'
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)} 
                  required 
                />
              </div>
              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="rePassword">Re-enter Password</Label>
                  <Input 
                    id="rePassword" 
                    type="password" 
                    placeholder='Re-enter Password'
                    value={rePassword}
                    onChange={(e)=>setRePassword(e.target.value)} 
                    required 
                  />
                </div>
              )}
              <Button type="submit" className="w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <SigninGoogle />

            {isSignUp ? (
                <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
                </div>
            )
            :
            (
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            )}
            </div>
          </form>
        </CardContent>
      </Card>
  )
}

export default CardSign