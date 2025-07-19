import { NextResponse } from "next/server";
import { z } from "zod";
import redis from "@/lib/redis";
import {prisma} from "@/lib/prisma"

const phoneSchema = z.object({
  phonenumber: z.string().regex(/^[0-9]{10}$/),
});

export async function POST(req: Request) {
    try {
    const body = await req.json();
    const { phonenumber } = phoneSchema.parse(body);
    
    const otpKey = `otp:${phonenumber}`;
      const otpData = {
      //otp,
      attempts: 0,
      timestamp: Date.now()
    };
     await redis.setex(otpKey, 300, JSON.stringify(otpData));
     
    }
     catch{

     }
}
