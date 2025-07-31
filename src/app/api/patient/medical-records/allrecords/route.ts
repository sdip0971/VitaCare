
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records = await prisma.medicalRecord.findMany({
      where: {
        patientId: currentUser.id,
      },
      orderBy: {
        uploadDate: "desc",
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records." },
      { status: 500 }
    );
  }
}