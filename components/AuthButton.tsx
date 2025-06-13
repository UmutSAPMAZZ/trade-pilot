"use client";
import { signIn } from "next-auth/react";

type Provider = "google" | "github";

export default function AuthButton({ provider }: { provider: Provider }) {
  const handleLogin = () => signIn(provider, { callbackUrl: "/dashboard" });

  return (
    <button
      onClick={handleLogin}
      className={`px-4 py-2 rounded-md text-white ${
        provider === "google" ? "bg-red-600" : "bg-gray-800"
      }`}
    >
      {provider === "google" ? "Google ile Giriş" : "GitHub ile Giriş"}
    </button>
  );
}