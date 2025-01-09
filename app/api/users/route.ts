import User from "@/lib/models/user";
import { NextResponse } from "next/server";

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

    const parsedUserId = parseInt(User_Id, 10);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    console.log("Fetching User_Id:", User_Id);

    const user = await User.findOne({
      where: { User_Id: parsedUserId },
    });

    console.log("Querying database with ID:", parsedUserId);
    console.log("User query result:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      First_Name: user.dataValues.First_Name,
      Last_Name: user.dataValues.Last_Name,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
