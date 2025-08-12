"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  // Get current tab from URL params, default to "patient"
  const currentTab = searchParams.get("tab") || "patient";

  // Enhanced phone number validation
  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(cleaned);
  }, []);

  // Email validation
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const formatPhoneNumber = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, 10); 
  }, []);
  useEffect(() => {
    // Force testing mode in development
    if (process.env.NODE_ENV === "development") {
      // Multiple ways to enable testing mode
      try {
        (auth as any).settings = { appVerificationDisabledForTesting: true };
        auth.settings.appVerificationDisabledForTesting = true;

        console.log("🔧 Testing mode force-enabled");
      } catch (error) {
        console.log("Testing mode setup:", error);
      }
    }
  }, []);

  useEffect(() => {
    const initializeRecaptcha = async () => {
      // Only initialize reCAPTCHA for patient tab
      if (currentTab === 'patient' && !window.recaptchaVerifier && recaptchaContainerRef.current) {
        try {
          console.log("Initializing reCAPTCHA for patient tab...");

          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            recaptchaContainerRef.current,
            {
              size: "normal",
              callback: (response: string) => {
                console.log("reCAPTCHA resolved successfully", response);
                setIsRecaptchaReady(true);
              },
              "expired-callback": () => {
                console.error("reCAPTCHA expired");
                setError("Security check expired. Please try again.");
                setIsRecaptchaReady(false);
              },
            }
          );
          await window.recaptchaVerifier.render();
          setIsRecaptchaReady(true);
      
        } catch (error) {
          console.error("reCAPTCHA initialization error:", error);
          setError("Failed to initialize security check. Please refresh the page.");
        }
      } else if (currentTab === 'doctor') {
        // Clear reCAPTCHA for doctor tab and set ready state for faster loading
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          } catch (error) {
            console.warn("Error clearing reCAPTCHA:", error);
          }
        }
        setIsRecaptchaReady(false);
      }
    };

    initializeRecaptcha();

    return () => {
      // Cleanup only if switching away from patient tab or component unmounting
      if (window.recaptchaVerifier && currentTab !== 'patient') {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.warn("Error clearing reCAPTCHA:", error);
        } finally {
          window.recaptchaVerifier = undefined;
          setIsRecaptchaReady(false);
        }
      }
    };
  }, [currentTab]);

  const handleTabChange = (value: string) => {

    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`/auth/login?${params.toString()}`);
  };

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(""); // Clear error when user starts typing
  }, [formatPhoneNumber]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user starts typing
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(""); // Clear error when user starts typing
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (currentTab === 'patient') {
        // Patient login with phone number and OTP
        if (!validatePhoneNumber(phoneNumber)) {
          throw new Error(
            "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9."
          );
        }

        // Check if reCAPTCHA is ready
        if (!window.recaptchaVerifier || !isRecaptchaReady) {
          throw new Error(
            "Security verification is not ready. Please wait a moment and try again."
          );
        }

        const formattedPhoneNumber = `+91${phoneNumber}`;
        console.log("Sending OTP to:", formattedPhoneNumber);

        // Use the reCAPTCHA verifier with signInWithPhoneNumber
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;

        // Navigate to verification page
        router.push(`/auth/verify?phone=${phoneNumber}`);
        
      } else if (currentTab === 'doctor') {
        // Doctor login with email and password
        if (!validateEmail(email)) {
          throw new Error("Please enter a valid email address.");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        
        // Doctor authentication API call
        const response = await fetch('/api/doctor/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData || "Login failed. Please try again.");
        }
      

        const data = await response.json();
        if(data.error){
          setError(data.error)
          return
        }
        console.log("Doctor login successful:", data);
        router.push('/doctor/dashboard')
        
      }
    } catch (error: any) {
      const errorMessage = error.message;
      setError(errorMessage);

   
      if (currentTab === 'patient' && window.recaptchaVerifier) {
        try {
          await window.recaptchaVerifier.render();
        } catch (renderError) {
          console.error("Error re-rendering reCAPTCHA:", renderError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientForm = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mobile-number">Mobile Number</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              +91
            </span>
            <Input
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              id="mobile-number"
              type="tel"
              placeholder="10-digit mobile number"
              className="pl-12"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* reCAPTCHA container - only for patients */}
        {currentTab === 'patient' && (
          <div
            ref={recaptchaContainerRef}
            className="flex justify-center my-4"
          />
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {currentTab === 'patient' && !isRecaptchaReady && !error && (
          <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
            Initializing security verification...
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={isLoading || (currentTab === 'patient' && (!isRecaptchaReady || !phoneNumber))}
          className="w-full mt-2" 
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending OTP...
            </>
          ) : (
            "Send OTP as Patient"
          )}
        </Button>
      </CardFooter>
    </form>
  );

  const renderDoctorForm = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            value={email}
            onChange={handleEmailChange}
            id="email"
            type="email"
            placeholder="doctor@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            onChange={handlePasswordChange}
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full mt-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login as Doctor"
          )}
        </Button>
      </CardFooter>
    </form>
  );

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Login/SignUp</CardTitle>
          <CardDescription>
            Please select your role and enter your details to continue.
          </CardDescription>
        </CardHeader>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="patient" className="mt-4">
            {renderPatientForm()}
          </TabsContent>
          
          <TabsContent value="doctor" className="mt-4">
            {renderDoctorForm()}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
