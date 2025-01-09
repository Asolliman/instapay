"use client";

import { useState } from "react";

export default function TransferPage() {
  const [formData, setFormData] = useState({
    Receiver_Id: "",
    Amount: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const Sender_Id = await fetch(`/api/users/me`)
      .then((res) => res.json())
      .then((data) => data.user.User_Id);
    if (!Sender_Id) {
      setResponseMessage("User not logged in.");
      return;
    }
    // console.log(Sender_Id);

    if (!Sender_Id) {
      setResponseMessage("User not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, Sender_Id: parseInt(Sender_Id) }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setResponseMessage("Transfer successful!");
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
      <h1 className="text-2xl font-bold mb-4">Transfer Amount</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="Receiver_Id" className="block text-sm font-medium">
            Receiver ID:
          </label>
          <input
            type="number"
            id="Receiver_Id"
            name="Receiver_Id"
            value={formData.Receiver_Id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="Amount" className="block text-sm font-medium">
            Amount:
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Transfer
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-sm">{responseMessage}</p>}
    </div>
  );
}
