

import { MedicalRecord } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./button";
import { Eye } from "lucide-react";

interface PatientRecordsProps {
  medicalRecords: MedicalRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MedicalRecord[]>>;
}

function PatientRecords({ medicalRecords,setRecords }: PatientRecordsProps) {
  if (!medicalRecords || medicalRecords.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No medical records have been uploaded yet.
      </p>
    );
  }

  const handleVisibility = (record: MedicalRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? { ...r, isHidden: !r.isHidden } : r))
    );

  } 

   return (
     <div className="space-y-3 p-1">
       {medicalRecords.map((record) => {
         const isVisible = !record.isHidden;
         return (
           <div
             key={record.id}
             className="w-full p-4 border rounded-lg flex items-center justify-between transition-all hover:shadow-md hover:border-primary/50"
           >
             <Link href={record.fileUrl} className="flex-grow truncate pr-4">
               <p className="font-semibold truncate">{record.title}</p>
               <p className="text-sm text-gray-500">
                 Uploaded: {format(new Date(record.uploadDate), "PPP")}
               </p>
             </Link>
             <button
               onClick={(e) => {
                 e.preventDefault();
                 console.log("toogling");
                 handleVisibility(record);
               }}
               className="flex items-center gap-2 flex-shrink-0 cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
             >
               <span
                 className={cn(
                   "h-2.5 w-2.5 rounded-full",
                   isVisible ? "bg-green-500" : "bg-red-500"
                 )}
               />
               <span className="text-sm font-medium">
                 {isVisible ? "Visible" : "Hidden"}
               </span>
             </button>
             <Link href={`/patient/dashboard/view/${record.id}`}>
               <Button variant="outline" size="sm">
                 <Eye className="h-4 w-4 mr-1" />
                 View
               </Button>
             </Link>
           </div>
         );
       })}
     </div>
   );
}

export default PatientRecords;
