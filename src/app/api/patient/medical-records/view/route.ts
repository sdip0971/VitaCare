import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // // Ensure user has patient role
    // if (currentUser. !== "PATIENT") {
    //   return NextResponse.json(
    //     { error: "Access denied: Patient role required" },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    if (!recordId) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

  
    const record = await prisma.medicalRecord.findFirst({
      where: {
        id: recordId,
        patientId: currentUser.id,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Record not found or access denied" },
        { status: 404 }
      );
    }

  
    const bucket = adminStorage.bucket("vitacare-v3.firebasestorage.app");
    const fileUrl = record.fileUrl;
    
    console.log(`Processing file URL: ${fileUrl}`);

  
    let filePath: string;
    if (fileUrl.includes("storage.googleapis.com")) {

      const urlParts = fileUrl.split("/");
      const bucketIndex = urlParts.findIndex(
        (part) => part.includes("vitacare-v3.firebasestorage.app")
      );
      filePath = urlParts.slice(bucketIndex + 1).join("/");
    } else if (fileUrl.includes("firebasestorage.googleapis.com")) {
      const match = fileUrl.match(/\/o\/(.+?)\?/);
      filePath = match ? decodeURIComponent(match[1]) : "";
    } else {
      throw new Error("Invalid file URL format");
    }

    if (!filePath) {
      throw new Error("Could not extract file path from URL");
    }
    
    const file = bucket.file(filePath);

    // Check if file exists before generating signed URL
    const [exists] = await file.exists();
    if (!exists) {
      console.error(`File does not exist: ${filePath}`);
      return NextResponse.json(
        { error: "File not found in storage" },
        { status: 404 }
      );
    }

    // we will create a signed url expires in 1 hr so that user can view this file this is required by firebase

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    
    console.log("✅ Generated signed URL successfully");


    return NextResponse.json({

      signedUrl,


      record: {
        id: record.id,
        title: record.title,
        type: record.type,
        uploadDate: record.uploadDate,
        description: record.description,
        isHidden: record.isHidden,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to load file data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
