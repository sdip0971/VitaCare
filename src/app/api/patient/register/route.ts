import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import { Role,bloodgroup} from "@/generated/prisma"; 


const GenderEnum = z.enum(["Male", "Female", "Other"]);


const patientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long."),
 dateOfBirth: z.string().datetime().optional().nullable(),
  gender: GenderEnum.optional().nullable(),
  address: z.string().optional().nullable(),
  Bloodgroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  profilePictureUrl: z.string().url().optional().nullable(),
  onboardingToken: z.string().min(1, "Onboarding token is required."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

   
    const validation = patientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input.", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      address,
      Bloodgroup,
      profilePictureUrl:profilepicture,
      onboardingToken,
    } = validation.data;


    const onboardingKey = `onboarding:${onboardingToken}`;
    const phoneNumber = await redis.get(onboardingKey);

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }


    await redis.del(onboardingKey);

   
    const existingUser = await prisma.patientProfile.findUnique({
      where: { contactNumber: phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this phone number already exists." },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        role: Role.PATIENT,
        patientProfile: {
          create: {
            fullName,
            BloodGroup: Bloodgroup as bloodgroup,
            contactNumber: phoneNumber,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender,
            address: address || null,
            profilePictureUrl: profilepicture || null,
            isonBoarded: true,
          },
        },
      },
    });

 
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionKey = `session:${sessionToken}`;
    const sessionExpiry = 60 * 60 * 24 * 7; // 7 days

    await redis.set(
      sessionKey,
      JSON.stringify({ userId: newUser.id }),
      "EX",
      sessionExpiry
    );

  (await cookies()).set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionExpiry,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
