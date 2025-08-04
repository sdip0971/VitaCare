

import { MedicalRecord } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "./button";
import { Eye } from "lucide-react";

interface PatientRecordsProps {
  medicalRecords: MedicalRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MedicalRecord[]>>;
}

function PatientRecords({ medicalRecords,setRecords }: PatientRecordsProps) {
  const router = useRouter();
  
  if (!medicalRecords || medicalRecords.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No medical records have been uploaded yet.
      </p>
    );
  }

  const handleVisibility = async(record: MedicalRecord) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, isHidden: !r.isHidden } : r
      )
    );
    const res = fetch("/api/patient/medical-records/tooglevisibilty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordId: record.id,
      }),
    });
    const response = (await res).json()
    console.log("VIsibility",res)
  } 

   return (
     <div className="space-y-3 p-1">
       {medicalRecords.map((record) => {
         const isVisible = !record.isHidden;
         function handleViewRecord(record: MedicalRecord) {
            console.log('Navigating to:', `/view-record/${record.id}`);
            router.push(`/view-record/${record.id}`);
         }

         return (
           <div
             key={record.id}
             className="w-full p-4 border rounded-lg flex items-center justify-between transition-all hover:shadow-md hover:border-primary/50"
           >
             <div 
               onClick={() => handleViewRecord(record)}
               className="flex-grow truncate pr-4 cursor-pointer"
             >
               <p className="font-semibold truncate">{record.title}</p>
               <p className="text-sm text-gray-500">
                 Uploaded: {format(new Date(record.uploadDate), "PPP")}
               </p>
             </div>
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

             <Button
               size="sm"
               variant="outline"
               onClick={() => handleViewRecord(record)}
               className="h-6 px-2 text-xs"
             >
               <Eye className="h-3 w-3 mr-1" />
               View
             </Button>
           </div>
         );
       })}
     </div>
   );
}

export default PatientRecords;
