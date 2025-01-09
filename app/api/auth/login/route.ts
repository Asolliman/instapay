import { NextResponse } from "next/server";
import { verifyUserPassword, generateJWT } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { govId, password } = await request.json();

    // Validate input
    if (!govId || !password) {
      return NextResponse.json(
        { message: "Government ID and Password are required" },
        { status: 400 }
      );
    }

    // Verify user credentials
    const user = (await verifyUserPassword(govId, password)).dataValues;
    if (!user) {
      return NextResponse.json(
        { message: "Invalid Government ID or Password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateJWT(user.User_Id);

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "strict", // Prevent CSRF
      path: "/", // Make the cookie accessible site-wide
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Optionally, set the user ID in another cookie or response payload
    console.log(user);
    response.cookies.set("User_Id", user.User_Id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error);
    // Return a generic error message for security purposes
    return NextResponse.json(
      { message: "Something went wrong, please try again" },
      { status: 500 }
    );
  }
}
