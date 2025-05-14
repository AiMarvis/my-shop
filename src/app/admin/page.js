"use client";
import { NavBar } from "@/components/nav-bar";

export default function AdminPage() {
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