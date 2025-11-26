"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DoctorProfile } from "@/generated/prisma";

interface DoctorDashProps {
  doctor: DoctorProfile;
}

function DoctorDash({ doctor }: DoctorDashProps) {
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setError("Please enter a patient ID.");
      return;
    }
    setIsLoading(true);
    setError(null);


    console.log("Searching for patient with ID:", patientId);


    setTimeout(() => {
      setIsLoading(false);
      alert(`Navigating to records for patient: ${patientId}`);
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full flex flex-col p-4 md:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-900 text-2xl mt-2">
          Welcome, Dr. {doctor.fullName}. Manage your Patients Records here
          here.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Find a Patient</CardTitle>
            <CardDescription>
              Enter a patient's unique ID to access their medical records.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSearch}>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Enter Patient ID (e.g., 8A3D4F1B)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                />
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search Patient"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="mt-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Patients you've recently accessed or treated
            </CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Patients
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default DoctorDash;
