import { PatientProfile } from "@/generated/prisma";
import { cache } from "react";
import redis from "./redis";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const getCurrentUser = cache(
  async (): Promise<PatientProfile | null> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const sessionKey = `session:${sessionToken}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    try {
      const { userId } = JSON.parse(sessionData as string);

      if (!userId) {
        return null;
      }

      const patientProfile = await prisma.patientProfile.findFirst({
        where: {
          user: {
            id: userId,
          },
        },
      });

      return patientProfile;
    } catch (error) {
      console.error("Failed to parse session data:", error);
      return null;
    }
  }
);
