'use client'
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { MedicalRecord } from "@/generated/prisma";
import PatientRecords from '@/components/ui/patientRecords';
function medicalrecords() {
   const [records, setRecords] = useState<MedicalRecord[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
     async function handleFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = event.target.files?.[0];
        if (file){
          console.log("Selected file:", file)
        }
        setIsLoading(true);
        setError(null);

        try {
          
          const urlResponse = await fetch(
            "/api/patient/medical-records/generate-upload-url",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fileName: file?.name,
                contentType: file?.type,
              }),
            }
          );
          console.log("URL Response:", urlResponse)

          if (!urlResponse.ok) {
            throw new Error("Could not prepare file for upload.");
          }

          const { signedUrl, finalUrl } = await urlResponse.json();

  
          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file?.type || "application/octet-stream" },
          });

          if (!uploadResponse.ok) {
            throw new Error("File upload failed.");
          }

          // Step 3: Create the medical record in our database
          const createRecordResponse = await fetch(
            "/api/patient/medical-records/create",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: file?.name,
                type: file?.type,
                fileUrl: finalUrl,
              }),
            }
          );

          if (!createRecordResponse.ok) {
            throw new Error("Failed to save the record to the database.");
          }

          // Refresh the list of medical records to show the new one
          fetchRecords();
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }

     }
      const handleUploadClick = () => {
        //  click the hidden file input because we want to trigger 
        fileInputRef.current?.click();
      };
     const fetchRecords = async () => {
       try {
         const response = await fetch("/api/patient/medical-records/get-records");
         if (!response.ok) {
           throw new Error("Failed to fetch records.");
         }
         const data = await response.json();  
         console.log("fetched records:",data)
         if(data.length === 0){
          setRecords([])
         }
         setRecords(data);
       } catch (err: any) {
         setError(err.message);
       } finally {
         setIsLoading(false);
       }
     };
     // Fetch all patient records when the component mounts
     useEffect(() => {
       fetchRecords();
     }, []);


 

   return (
     <div>
       <Card className="w-full  h-[50vh] max-w-full">
         <CardHeader className="relative flex justify-between items-center px-6">
           <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-600 font-bold text-2xl">
             Medical Records
           </div>
           <div className="ml-auto">
             <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               style={{ display: "none" }}
               accept="image/*,application/pdf"
             />

             <Button onClick={handleUploadClick}>
               {isLoading ? "Processing..." : "Upload Record"}
             </Button>
           </div>
         </CardHeader>

         <CardContent className="w-full h-full overflow-y-scroll space-y-3 pt-0">
         <PatientRecords medicalRecords = {records} setRecords={setRecords} />
         </CardContent>
       </Card>
     </div>
   );
}

export default medicalrecords
