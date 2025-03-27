import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db"

export async function GET(request: NextRequest) {
    return NextResponse.json(null, { status: 500 })
}
