// src/app/api/patient/medical-records/generate-upload-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";
import { getCurrentUser } from "@/lib/user";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;


if (!admin.apps.length) {
  const serviceAccount = {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: privateKey,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${projectId}.firebasestorage.app`,
  });
}

export async function POST(req: NextRequest) {
  try {
  
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      // If no user is logged in, return an unauthorized error
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { fileName, contentType } = body;

 

    if (!fileName || !contentType) {
      
      return NextResponse.json(
        { error: "Missing file name or content type." },
        { status: 400 }
      );
    }

    const bucket = getStorage().bucket();
    const filePath = `medical-records/${
      currentUser.id
    }/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15-minute expiry
      contentType: contentType,
    });

  
    const finalUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return NextResponse.json({ signedUrl, finalUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL." },
      { status: 500 }
    );
  }
}
