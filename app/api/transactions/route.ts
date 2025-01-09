import { NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("User_Id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch transactions for the user
    const transactions = await Transaction.findAll({
      where: { User_Id: parseInt(userId, 10) },
      attributes: ["Transaction_ID", "Type", "Amount", "Description", "Transaction_date"],
      order: [["Transaction_ID", "DESC"]],
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
