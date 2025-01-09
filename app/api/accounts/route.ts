import { NextResponse } from "next/server";
import Account from "@/lib/models/account";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  const accounts = await Account.findAll({ where: { User_ID: userId } });
  return NextResponse.json(accounts);
}
