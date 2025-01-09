// /app/page.tsx
"use client"
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Instapay</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
