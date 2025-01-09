import { NextResponse } from "next/server";
import Investment from "@/lib/models/investment";
import Account from "@/lib/models/account";
import { cookies } from "next/headers";
import Transaction from "@/lib/models/transaction";

export async function POST(request: Request) {
  const { price, Interest, Type } = await request.json();

  if (!price || !Interest || !Type) {
    return NextResponse.json(
      { error: "All fields (price, Interest, Type) are required" },
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

    // Fetch the user's account
    const userAccount = await Account.findOne({
      where: { User_Id: parseInt(User_Id, 10) },
    });

    if (!userAccount) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Ensure sufficient balance
    if (userAccount.dataValues.Balance < price) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct the price from the user's account balance
    userAccount.dataValues.Balance -= price;
    await userAccount.save();

    const lastInvestment = await Investment.findOne({
      order: [["Investment_id", "DESC"]],
    });

    if (!lastInvestment) {
      return NextResponse.json(
        { error: "No investments found" },
        { status: 404 }
      );
    }
    // console.log("Last investment:", lastInvestment)

    const newInvestmentId = lastInvestment
      ? lastInvestment.dataValues.Investment_id + 1
      : 1;

    // Create a new investment
    const newInvestment = await Investment.create({
      Investment_id: newInvestmentId,
      Type,
      price,
      Interest,
      Account_ID: userAccount.dataValues.Account_ID,
    });


    await Transaction.create({
      Transaction_ID: parseInt(newInvestmentId, 10),

      User_Id: parseInt(User_Id, 10),
      Type: "Transfer",
      Amount: parseFloat(price),
      Description: `Made investment to ${newInvestment.dataValues.Type}`,
    });

    return NextResponse.json({
      message: "Investment successful",
      investment: newInvestment.dataValues,
    });
  } catch (error) {
    console.error("Error processing investment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const User_Id = url.searchParams.get("User_Id");

    if (!User_Id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch investments associated with the user's account
    const investments = await Investment.findAll({
      where: { Account_ID: parseInt(User_Id, 10) },
      order: [["Investment_Date", "DESC"]],
    });

    return NextResponse.json({ investments });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
