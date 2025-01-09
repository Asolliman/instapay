import { NextResponse } from "next/server";
import Loan from "@/lib/models/loan";
import Account from "@/lib/models/account";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { Amount, Type } = await request.json();

  if (!Amount || !Type) {
    return NextResponse.json(
      { error: " Amount, Type, and Account ID are required" },
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

    // Update user's balance
    const userAccount = await Account.findOne({
      where: { User_Id: parseInt(User_Id, 10) },
    });

    const Account_ID = userAccount?.dataValues.Account_ID;

    const lastLoan = await Loan.findOne({
      order: [["Loan_Id", "DESC"]],
    });

    const newLoadId = lastLoan ? lastLoan.dataValues.Loan_Id + 1 : 1;

    // Create a loan
    const loan = await Loan.create({ Amount, Type, Account_ID, Loan_Id: newLoadId });

    if (!userAccount) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Deduct the loan amount from the user's balance (or update logic as required)
    userAccount.dataValues.Balance += Amount;

    await userAccount.save();

    return NextResponse.json({
      message: "Loan approved, account updated",
      loan: loan.dataValues,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
