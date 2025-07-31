import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'lucide-react';
import React from 'react'
import { Button } from 'react-day-picker';

export default function accessLog() {
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
