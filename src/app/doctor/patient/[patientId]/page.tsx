"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/ws-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalRecord } from "@/generated/prisma";
import PatientRecords from "@/components/ui/patientRecords";



export default function DoctorPatientView({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const router = useRouter();
  const { socket } = useSocket();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    const fetchRecords = async () => {
      try {
    
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecords();
  }, [patientId]);

  // 2. Listen for REVOKE events
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      if (data?.data?.patientId !== patientId) return;

      if (data.type === "ACCESS_REVOKED") {
        alert("Access has been revoked by the patient.");
        router.push("/doctor/dashboard");
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, patientId, router]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Records</h1>
        <Button
          variant="destructive"
          onClick={() => router.push("/doctor/dashboard")}
        >
          Close Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
        
          <PatientRecords medicalRecords={records} setRecords={setRecords} />
        </CardContent>
      </Card>
    </div>
  );
}
