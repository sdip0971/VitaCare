"use client"
import React, { ReactEventHandler, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { serialize } from 'v8';



export default function page() {
  const [phonenumber, setphonenumber] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const entereddigit = e.target.value;
    if (
      (entereddigit.toLowerCase() >= "a" &&
        entereddigit.toLowerCase() <= "z") ||
      entereddigit.length > 10
    ) {
      return;
    }
    setphonenumber(entereddigit);
  };
   const handlesubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
      try {
        const res = await fetch("/api/auth/otp/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phonenumber }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          setError(error)
        }
        
        router.push(`/auth/verify?phone=${phonenumber}`); 
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
   };
    
  return (
    <div className="w-screen h-screen">
      <div className="flex w-screen h-full justify-center items-center flex-col">
        <Tabs defaultValue="account" className="h-[80vh] w-[80vw]">
          <TabsList>
            <TabsTrigger value="account">Patient</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent className="h-full" value="account">
            <Card>
              <CardHeader>
                <CardTitle>Login/SignUp</CardTitle>
                <CardDescription className="p-1">
                  Please Enter Your Mobile Number
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlesubmit}>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="mobile-number">Mobile Number</Label>
                    <Input
                      value={phonenumber}
                      onChange={handleinput}
                      id="mobile-number"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </CardContent>
                <CardFooter className='p-2'>
                  <Button className="p-2"type="submit">Submit</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
