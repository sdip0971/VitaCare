import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";
import redis from "@/lib/redis";
import { cookies } from "next/headers";
// check token onboarding
//get phone number from redis
// initialize Firebase Admin
//save out photo to bucket with unique identity
//save url
//return as response
//on frontend we save with url

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export async function POST(req: NextRequest) {
  try {
    // This endpoint must be protected. We'll use the onboarding token for authorization.
    const {token} = await req.json()
    const onboardingKey = `onboarding:${token}`;
   
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token." },
        { status: 401 }
      );
    }

    const phoneNumber = await redis.get(onboardingKey);
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }

    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing file name or content type." },
        { status: 400 }
      );
    }

    const bucket = getStorage().bucket();
    // Use the phone number to create a unique folder path
    const filePath = `profile-pictures/${phoneNumber}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, 
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
