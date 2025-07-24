"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const router = useRouter();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Enhanced phone number validation
  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(cleaned);
  }, []);

  // Enhanced error message handling
  const getErrorMessage = useCallback((error: any): string => {
    switch (error.code) {
      case "auth/invalid-phone-number":
        return "Please enter a valid phone number.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
      case "auth/captcha-check-failed":
        return "Security verification failed. Please try again.";
      case "auth/quota-exceeded":
        return "SMS quota exceeded. Please try again later.";
      case "auth/app-not-authorized":
        return "App not authorized. Please check Firebase configuration.";
      case "auth/invalid-app-credential":
        return "Invalid app credentials. Please check your Firebase setup.";
      case "auth/internal-error":
        return "Authentication service error. Please try again.";
      default:
        console.error("Firebase Auth Error:", error);
        return "Failed to send OTP. Please try again.";
    }
  }, []);

  // Format phone number as user types
  const formatPhoneNumber = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, 10); // Limit to 10 digits
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
      if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
        try {
          console.log("Initializing reCAPTCHA...");
          console.log("Auth instance:", auth);
          console.log("Container ref:", recaptchaContainerRef.current);

          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            recaptchaContainerRef.current,
            {
              size: "normal", // Changed from invisible to normal
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

          console.log("reCAPTCHA verifier created, attempting to render...");
          await window.recaptchaVerifier.render();
          setIsRecaptchaReady(true);
          console.log("reCAPTCHA initialized successfully");
        } catch (error) {
          console.error("reCAPTCHA initialization error:", error);
          setError(
            "Failed to initialize security check. Please refresh the page."
          );
        }
      }
    };

    initializeRecaptcha();

    // Cleanup function
    return () => {
      if (window.recaptchaVerifier) {
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
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate phone number
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
    } catch (error: any) {
      const errorMessage = error.message || getErrorMessage(error);
      setError(errorMessage);

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
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

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Patient Login/SignUp</CardTitle>
          <CardDescription>
            Please enter your mobile number to continue.
          </CardDescription>
        </CardHeader>
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

            {/* reCAPTCHA container - now visible */}
            <div
              ref={recaptchaContainerRef}
              className="flex justify-center my-4"
            />

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {!isRecaptchaReady && !error && (
              <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                Initializing security verification...
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading || !isRecaptchaReady || !phoneNumber}
              className="w-full"
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
                "Send OTP"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
