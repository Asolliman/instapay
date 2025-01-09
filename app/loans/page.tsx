"use client";

import { useState } from "react";

export default function LoanPage() {
  const [formData, setFormData] = useState({
    Amount: "",
    Type: "",
    Account_ID: "",
    Loan_Id: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const User_Id = await fetch(`/api/users/me`)
      .then((res) => res.json())
      .then((data) => data.user.User_Id);
    if (!User_Id) {
      setResponseMessage("User not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, User_Id: parseInt(User_Id) }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setResponseMessage("Loan approved and account updated successfully.");
      } else {
        setResponseMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      setResponseMessage("Failed to connect to the server.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Apply for a Loan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="Amount" className="block text-sm font-medium">
            Loan Amount:
          </label>
          <input
            type="number"
            id="Amount"
            name="Amount"
            value={formData.Amount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="Type" className="block text-sm font-medium">
            Loan Type:
          </label>
          <input
            type="text"
            id="Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit Loan Request
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-sm">{responseMessage}</p>}
    </div>
  );
}
