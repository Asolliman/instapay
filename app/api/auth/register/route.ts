import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import bcrypt from "bcrypt";
import Account from "@/lib/models/account";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, govId, password } = await request.json();

    // Ensure all required fields are provided
    if (!firstName || !lastName || !govId || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if the government ID is already in use
    const existingUser = await User.findOne({
      where: { govId },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Government ID already in use" }, { status: 400 });
    }

    // Generate a random 3-digit user ID
    const userId = Math.floor(100 + Math.random() * 900);
    const randomPaymentId = Math.floor(100 + Math.random() * 900);
    const Account_ID= userId;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await User.create({
      User_Id: userId,
      Password: hashedPassword,
      First_Name: firstName,
      Last_Name: lastName,
      govId,
    });

    await Account.create({
      Account_ID: Account_ID,
      Balance: 2000,
      Type: "Checking",
      User_Id: userId,
    })

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
