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

  
    const bucket = adminStorage.bucket();
    const fileUrl = record.fileUrl;

  
    let filePath: string;
    if (fileUrl.includes("storage.googleapis.com")) {
      const urlParts = fileUrl.split("/");
      const bucketIndex = urlParts.findIndex(
        (part) =>
          part.includes("vitacare-v3") || part.includes(".firebasestorage.app")
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

    // we will create a signed url expires in 1 hr so that user can view this file this is required by firebase
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });


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
    console.error("Error in combined view endpoint:", error);
    return NextResponse.json(
      { error: "Failed to load file data" },
      { status: 500 }
    );
  }
}
