"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocket } from '@/contexts/ws-context';
import { Link } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from 'react-day-picker';
interface Request {
  id: string;
  doctor: {
    fullName: string;
    specialization: string;
    hospitalName?: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
}
export default function accessLog() {
  const [requests, setRequests] = useState<Request[]>([]);
  const { socket } = useSocket();
  return (
      <div>
        <Card className="w-full h-[50vh]  max-w-full">
          <CardHeader>
          <div className="flex justify-center text-gray-600 font-bold text-2xl ">
               Access Log
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
          </CardContent>
        </Card>
      </div>
    );
}
