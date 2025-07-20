"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Make Firebase's confirmationResult globally available on the window object
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phonenumber, setPhonenumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Set up the reCAPTCHA verifier once the component mounts to ensure firebase doesn’t spam otp by bots.


  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!/^\d{10}$/.test(phonenumber)) {
      setError("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }

    try {
      const formattedPhoneNumber = `+91${phonenumber}`;
      const appVerifier = window.recaptchaVerifier;
      
      // Send OTP using Firebase
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      
      // Store the result to use on the next page since we are making
      window.confirmationResult = confirmationResult;
      
      router.push(`/auth/verify?phone=${phonenumber}`);

    } catch (err: any) {
      setError("Failed to send OTP. Please check the console for details.");
      console.error("Firebase Auth Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {/* This empty div is REQUIRED for the invisible reCAPTCHA to work */}
      <div id="recaptcha-container"></div>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Login/SignUp</CardTitle>
          <CardDescription>Please enter your mobile number to continue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label htmlFor="mobile-number">Mobile Number</Label>
            <Input
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              id="mobile-number"
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}