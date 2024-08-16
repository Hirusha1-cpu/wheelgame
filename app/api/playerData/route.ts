import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { address, amount } = await req.json();
  return NextResponse.json({ message: "success" }, { status: 200 });
}
