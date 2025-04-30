// app/api/get-role/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ role: null });
  const role = user.publicMetadata?.role || "user";
  return NextResponse.json({ role });
}
