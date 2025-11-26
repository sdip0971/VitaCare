"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/ws-context";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WaitingPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const router = useRouter();
  const { socket } = useSocket();
  const [status, setStatus] = useState("Waiting for patient approval...");

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      // Ensure this notification is for the CURRENT patient being viewed
      if (data?.data?.patientId !== patientId) return;

      if (data.type === "ACCESS_APPROVED") {
        setStatus("Access Granted! Redirecting...");
        setTimeout(() => {
          router.replace(`/doctor/patient/${patientId}`);
        }, 1000);
      } else if (data.type === "ACCESS_REJECTED") {
        setStatus("Access Denied.");
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, patientId, router]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg border max-w-md w-full">
        {status.includes("Denied") ? (
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        ) : (
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
        )}

        <h2 className="text-2xl font-bold text-gray-800">{status}</h2>
        <p className="text-gray-500">
          {status.includes("Denied")
            ? "The patient rejected your request."
            : "Please ask the patient to approve the request on their dashboard."}
        </p>

        <Button
          variant="outline"
          onClick={() => router.push("/doctor/dashboard")}
        >
          Cancel & Go Back
        </Button>
      </div>
    </div>
  );
}
