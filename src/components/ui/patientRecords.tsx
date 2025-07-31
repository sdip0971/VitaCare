// src/components/PatientRecords.tsx
"use client";

import { MedicalRecord } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link"; // CORRECTED: Use the Next.js Link for navigation
import { format } from "date-fns"; // CORRECTED: Use date-fns to format dates
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PatientRecordsProps {
  medicalRecords: MedicalRecord[];
}

function PatientRecords({ medicalRecords }: { medicalRecords: MedicalRecord[] }) {

  if (!medicalRecords || medicalRecords.length === 0) {
    return (
      <p className="text-gray-500">
        No medical records have been uploaded yet.
      </p>
    );
  }

  return (

    <div className="h-full flex flex-cols-1 md:flex-cols-2 lg:flex-cols-3 gap-4">
      {medicalRecords.map((record) => {
        const isVisible = !record.isHidden;
        return (
          <div key={record.id}>
            <Link
              href={record.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="truncate text-lg">
                    {record.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid  min-h-0 gap-4">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Upload Date:</span>
                    <span>{format(new Date(record.uploadDate), "PPP")}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          isVisible ? "bg-green-500" : "bg-red-500"
                        )}
                      />
                      <span className="text-sm font-medium">
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default PatientRecords;
