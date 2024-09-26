import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Atip Poonkatevit",
    studentId: "660610805",
  });
};
