import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Make sure your redis import works
import twilio from "twilio";
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;



export async function POST(req: Request) {
try {
  const body = await req.json();

  const { phonenumber } = body;

  if (!phonenumber || !/^\d{10}$/.test(phonenumber)) {
    return NextResponse.json(
      { error: "Valid 10-digit phone number is required." },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${phonenumber}`;

  // Save OTP to Redis with a 5-minute expiry
  await redis.set(otpKey, otp, "EX", 300);



await twilioClient.verify.v2
  .services(verifyServiceSid)
  .verifications.create({ to: `+91${phonenumber}`, channel: "sms" });


  return NextResponse.json({ message: "OTP sent successfully." },{status:200});
} catch (error) {
  console.error("OTP Generation Error:", error);
  return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
}
}
