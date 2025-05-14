"use client";

import KakaoLoginButton from '@/components/KakaoLoginButton';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            소셜 계정으로 간편하게 로그인하세요
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
} 