"use client";

import { useEffect, useState } from "react";

interface Transaction {
  Transaction_ID: number;
  Amount: number;
  Transaction_date: string;
  Type: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // console.log(userId)
      const User_Id = await fetch(`/api/users/me`)
        .then((res) => res.json())
        .then((data) => data.user.User_Id);
      // console.log(User_Id)
      const response = await fetch(`/api/transactions?User_Id=${User_Id}`);
      const data = await response.json();
      setTransactions(data.transactions);
      // console.log(data)
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Transactions</h1>
      <table className="w-full mt-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Transaction ID</th>
            <th className="border border-gray-400 p-2">Amount</th>
            <th className="border border-gray-400 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.Transaction_ID}>
              <td className="border border-gray-400 p-2">
                {transaction.Transaction_ID}
              </td>
              <td className="border border-gray-400 p-2">
                {transaction.Amount}
              </td>
              <td className="border border-gray-400 p-2">
                {transaction.Transaction_date}
              </td>
              <td className="border border-gray-400 p-2">
                {transaction.Type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
