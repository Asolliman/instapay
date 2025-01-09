// api/payments/route.ts
import { NextResponse } from "next/server";
import Payment from "@/lib/models/payment";
import Account from "@/lib/models/account";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { Amount, Type, Status } = await request.json();

  if (!Amount || !Type || !Status) {
    return NextResponse.json(
      { error: "Amount, Type, and Status are required" },
      { status: 400 }
    );
  }

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Account_ID = userAccount.dataValues.Account_ID;

    // Create payment record
    const payment = await Payment.create({
      Amount,
      Type,
      Status,
    });

    // Update the user's balance based on the payment
    if (Status === "completed") {
      userAccount.dataValues.Balance -= Amount; // Assuming the payment deducts balance
      await userAccount.save();
    }

    return NextResponse.json({
      message: "Payment recorded successfully",
      payment: payment.dataValues,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
