"use client";

import { signInWithKakao } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('카카오 로그인 버튼 클릭');
      const { data, error } = await signInWithKakao();
      
      if (error) {
        console.error('로그인 에러:', error);
        setError(error.message || '로그인 중 오류가 발생했습니다.');
        return;
      }
      
      // 로그인 성공 처리
      console.log('로그인 성공:', data);
      
      // URL이 있는 경우 해당 URL로 리다이렉트
      if (data?.url) {
        console.log('리다이렉트 URL:', data.url);
        // URL이 있는 경우 새 창에서 열지 않고 현재 창에서 열기
        window.location.href = data.url;
      } else {
        console.log('리다이렉트 URL이 없습니다. 새로고침 시도...');
        router.refresh();
      }
    } catch (error) {
      console.error('예상치 못한 오류:', error);
      setError('예상치 못한 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-black font-medium py-3 px-4 rounded-md hover:bg-[#ffea24] transition-colors"
      >
        {isLoading ? (
          <span>로그인 중...</span>
        ) : (
          <>
            <svg
              width="20"
              height="19"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M128 36C70.562 36 24 72.713 24 118C24 147.67 43.944 173.493 73.17 186.835C70.792 197.161 64.385 217.565 62.57 223.293C60.302 230.525 66.746 236.264 73.269 231.569C78.257 227.979 101.318 212.402 112.763 204.759C117.716 205.565 122.803 206 128 206C185.438 206 232 169.287 232 124C232 78.713 185.438 36 128 36Z"
                fill="black"
              />
            </svg>
            <span>카카오 계정으로 로그인</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 