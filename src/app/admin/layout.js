"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setIsCheckingAuth(false);
        return;
      }
      if (profile && profile.role === 'admin') {
        setIsAuthorized(true);
      }
      setIsCheckingAuth(false);
    }
  }, [user, profile, loading, router]);

  if (isCheckingAuth) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg">관리자 권한을 확인 중입니다...</p>
          </div>
        </main>
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h1 className="text-2xl font-bold">접근 권한 없음</h1>
            <p className="mt-2">이 페이지에 접근할 수 있는 관리자 권한이 없습니다.</p>
            <p className="mt-4">
              <Link href="/" className="text-blue-500 hover:underline">
                홈으로 돌아가기
              </Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
} 