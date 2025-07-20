import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Make sure your redis import works
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required." },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${phoneNumber}`;

    // Save OTP to Redis with a 5-minute expiry
    await redis.set(otpKey, otp, "EX", 300);

    await twilioClient.messages.create({
      body: `Your VitaCare verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, 
    });

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
