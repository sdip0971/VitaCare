import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("session_token")?.value;

    if (sessionToken) {
      const sessionKey = `session:${sessionToken}`;

      await redis.del(sessionKey);
      
      (await cookieStore).delete("session_token");
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
