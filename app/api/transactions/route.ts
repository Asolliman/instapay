// api/transactions/route.ts
import { NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const User_Id = url.searchParams.get("User_Id");

  if (!User_Id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  console.log(User_Id);
  try {
    const transactions = await Transaction.findAll({
      where: { User_Id: parseInt(User_Id) },
      
    });

    return NextResponse.json({transactions});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
