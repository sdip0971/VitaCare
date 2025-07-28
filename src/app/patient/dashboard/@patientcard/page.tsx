"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Patient {
  fullName: string;
  dateOfBirth: string | Date; 
  gender: string;
  Bloodgroup: string; 
  
}

interface PatientCardProps {
  patient: Patient;
}

// A helper function to calculate age from the date of birth
const calculateAge = (dob: string | Date): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{patient.fullName}</CardTitle>
        <CardDescription>
          {patient.gender} | Age: {calculateAge(patient.dateOfBirth)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <span className="font-medium">Blood Group:</span>
          <span className="text-gray-700 dark:text-gray-300">
            {patient.Bloodgroup}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
