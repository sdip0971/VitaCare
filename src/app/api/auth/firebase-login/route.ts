// src/app/api/auth/firebase-login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Initialize Firebase Admin (you'll need to install firebase-admin)
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (add this to your environment variables)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number not found in token" },
        { status: 400 }
      );
    }

    // Extract phone number without country code for database lookup
    const cleanPhoneNumber = phoneNumber.replace("+91", "");

    // Check if user exists in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: phoneNumber }, // Store phone as email for now
          {
            patientProfile: {
              contactNumber: cleanPhoneNumber,
            },
          },
        ],
      },
      include: {
        patientProfile: true,
      },
    });

    let isOnboarded = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: phoneNumber,
          passwordHash: "", // Not needed for phone auth
          role: "PATIENT",
          patientProfile: {
            create: {
              fullName: "New User", // Will be updated during onboarding
              contactNumber: cleanPhoneNumber,
              isonBoarded: false,
            },
          },
        },
        include: {
          patientProfile: true,
        },
      });
    } else {
      isOnboarded = user.patientProfile?.isonBoarded || false;
    }

    // Create JWT token for your app
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        phoneNumber: cleanPhoneNumber,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      isOnboarded,
      user: {
        id: user.id,
        role: user.role,
        phoneNumber: cleanPhoneNumber,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
