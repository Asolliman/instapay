// api/payments/history.ts
import { NextResponse } from "next/server";
import Payment from "@/lib/models/payment";
import Account from "@/lib/models/account";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const User_Id = (await cookies()).get("User_Id")?.value;

    if (!User_Id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userAccount = await Account.findOne({
      where: { User_Id: parseInt(User_Id, 10) },
    });

    if (!userAccount) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    const payments = await Payment.findAll({
      where: { Payment_Id: userAccount.dataValues.Account_ID },
      order: [["Payment_Date", "DESC"]],
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
