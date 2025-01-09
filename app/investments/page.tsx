/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function InvestmentPage() {
  const [formData, setFormData] = useState({
    price: "",
    Interest: "",
    Type: "",
  });
  const [investments, setInvestments] = useState([]);
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
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage("Investment successful!");
        fetchInvestments();
        setFormData({ price: "", Interest: "", Type: "" });
      } else {
        setResponseMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting investment:", error);
      setResponseMessage("Failed to connect to the server.");
    }
  };

  const fetchInvestments = async () => {
    const User_Id = await fetch(`/api/users/me`)
      .then((res) => res.json())
      .then((data) => data.user.User_Id);

    if (!User_Id) {
      setResponseMessage("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`/api/investments?User_Id=${User_Id}`);
      const data = await response.json();
      if (response.ok) {
        setInvestments(data.investments || []);
      } else {
        setResponseMessage(data.error || "Failed to fetch investments.");
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      setResponseMessage("Failed to fetch investments.");
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invest in Stocks</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="Type" className="block text-sm font-medium">
            Stock Type:
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
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Investment Amount:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="Interest" className="block text-sm font-medium">
            Interest Rate (%):
          </label>
          <input
            type="number"
            id="Interest"
            name="Interest"
            value={formData.Interest}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit Investment
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-sm">{responseMessage}</p>}
      <h2 className="mt-6 text-xl font-semibold">Investment History</h2>
      <ul className="mt-4 space-y-2">
        {investments.map((investment: any) => (
          <li key={investment.Investment_id} className="bg-gray-100 p-2 rounded">
            {investment.Type} - ${investment.price} (Interest:{" "}
            {investment.Interest}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
