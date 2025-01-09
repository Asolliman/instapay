"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to install the js-cookie package

interface User {
  First_Name: string;
  Last_Name: string;
  User_Id: number;
}

export default function ClientDashboard({ user }: { user: User | null }) {
  const [userData, setUserData] = useState<User | null>(user);
  const router = useRouter();

  const handleSignOut = () => {
    // Clear cookies or tokens
    Cookies.remove("token"); // Remove token from cookies
    Cookies.remove("userId"); // Remove userId from cookies

    // Optionally, you can also remove session data or local storage entries if necessary
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    router.push("/");
  };

  useEffect(() => {
    if (!userData) {
      // Optionally refetch or handle client-specific logic
      const User_Id = localStorage.getItem("User_Id");

      if (User_Id) {
        fetch(`/api/users?userId=${User_Id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch user data");
            }
            return res.json();
          })
          .then((data) => {
            setUserData(data);
          })
          .catch((err) => console.error("Error fetching user data:", err));

          
      }
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }


  return (
    <div>
      <h2>
        Welcome, {userData.First_Name} {userData.Last_Name}! 
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <a
          href="/transactions"
          className="block bg-white shadow p-4 rounded-lg hover:bg-gray-100"
        >
          View Transactions
        </a>
        <a
          href="/loans"
          className="block bg-white shadow p-4 rounded-lg hover:bg-gray-100"
        >
          Manage Loans
        </a>
        <a
          href="/investments"
          className="block bg-white shadow p-4 rounded-lg hover:bg-gray-100"
        >
          Manage Investments
        </a>
        <a
          href="/transfers"
          className="block bg-white shadow p-4 rounded-lg hover:bg-gray-100"
        >
          Transfer Money
        </a>
        <a
          href="/payments"
          className="block bg-white shadow p-4 rounded-lg hover:bg-gray-100"
        >
          View Payments
        </a>
      </div>
      {/* Sign-out button */}
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
