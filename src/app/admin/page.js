"use client";
import { NavBar } from "@/components/nav-bar";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되었고 사용자가 로그인하지 않은 경우
    if (!loading && !user) {
      setIsLoading(false);
      return;
    }

    // 로딩이 완료되고 프로필이 로드된 경우
    if (!loading && profile) {
      setIsAdmin(profile.role === 'admin');
      setIsLoading(false);
    }
  }, [loading, user, profile]);

  if (isLoading) {
    return (
      <>
        <NavBar />
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl mx-auto p-4">
          <div className="text-center w-full">로딩 중...</div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl mx-auto p-4">
          <div className="text-center w-full">
            <h1 className="text-2xl font-bold text-red-500">접근 제한</h1>
            <p className="mt-4">이 페이지에 접근하려면 로그인이 필요합니다.</p>
          </div>
        </main>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <NavBar />
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl mx-auto p-4">
          <div className="text-center w-full">
            <h1 className="text-2xl font-bold text-red-500">권한 없음</h1>
            <p className="mt-4">관리자 권한이 필요한 페이지입니다.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold">관리 페이지</h1>
        <div className="bg-blue-500 w-full h-96 flex items-center justify-center text-white">
          관리자 콘텐츠
        </div>
      </main>
    </>
  );
} 