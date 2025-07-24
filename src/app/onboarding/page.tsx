"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(); // State for the date
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingToken, setOnboardingToken] = useState<string | null>(null);
    const token = searchParams.get("token");
  useEffect(() => {

    if (token) {
      setOnboardingToken(token);
    } else {
      setError("Invalid onboarding session. Please start over.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!onboardingToken) {
      setError("Session expired. Please try logging in again.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = {
        fullName,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null, 
        gender,
        address,
        onboardingToken,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to create account.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome! Please fill in your details to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g., John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <DatePicker date={dateOfBirth} setDate={setDateOfBirth} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !onboardingToken}>
              {isLoading ? "Saving..." : "Save and Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
