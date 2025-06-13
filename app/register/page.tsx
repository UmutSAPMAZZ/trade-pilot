'use client';
import  AuthButton  from "@/components/AuthButton";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Hesap Oluştur</h1>
        <AuthButton provider="google" />
        <AuthButton provider="github" />
      </div>
    </div>
  );
}
