'use client';
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline">Hoş geldin, {session.user?.name}</span>
        <button 
          onClick={() => signOut()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Çıkış Yap
        </button>
      </div>
    );
  }
  
  return (
    <button 
      onClick={() => signIn('google')}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
    >
      Google ile Giriş Yap
    </button>
  );
}