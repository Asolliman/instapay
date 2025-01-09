import React from "react";
import { cookies } from "next/headers";
import ClientDashboard from "@/components/ClientDashboard";

export default async function DashboardPage() {
  

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return (
      <div>
        <h1>You are not logged in!</h1>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  // Optional: Fetch user data or initial data server-side
  const User_Id = (await cookies()).get("User_Id")?.value;
  let user = null;

  if (User_Id) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users?User_Id=${User_Id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(User_Id);
    if (res.ok) {
      user = await res.json();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
      <ClientDashboard user={user} />
      
    </div>
  );
}
