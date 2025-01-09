// pages/payments.tsx
"use client";

import { useEffect, useState } from "react";

type Payment = {
  Payment_Id: number;
  Amount: number;
  Type: string;
  Status: string;
  Payment_Date: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>("");

  useEffect(() => {
    async function fetchPayments() {
      const User_Id = await fetch(`/api/users/me`)
        .then((res) => res.json())
        .then((data) => data.user.User_Id);

      if (!User_Id) {
        setResponseMessage("User not logged in.");
        return;
      }

      try {
        const response = await fetch(`/api/payments/history`);
        const data = await response.json();

        if (response.ok) {
          setPayments(data.payments);
        } else {
          setResponseMessage(data.error || "Failed to fetch payment history.");
        }
      } catch (error) {
        console.error(error);
        setResponseMessage("Failed to connect to the server.");
      }
    }

    fetchPayments();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      {responseMessage && <p className="text-red-500">{responseMessage}</p>}

      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr>
            <th className="p-4 border-b">Payment ID</th>
            <th className="p-4 border-b">Amount</th>
            <th className="p-4 border-b">Type</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">No payments found</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.Payment_Id}>
                <td className="p-4 border-b">{payment.Payment_Id}</td>
                <td className="p-4 border-b">${payment.Amount.toFixed(2)}</td>
                <td className="p-4 border-b">{payment.Type}</td>
                <td className="p-4 border-b">{payment.Status}</td>
                <td className="p-4 border-b">{new Date(payment.Payment_Date).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
