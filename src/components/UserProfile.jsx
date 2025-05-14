"use client";

import { useAuth } from '@/lib/AuthContext';
import { signOut } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, User, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.refresh();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // 프로필 이미지: 먼저 profiles 테이블의 정보를 사용하고, 없으면 user_metadata에서 가져오기
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  
  // 이름: 먼저 profiles 테이블의 정보를 사용하고, 없으면 user_metadata에서 가져오기 
  const fullName = profile?.full_name || 
                  user.user_metadata?.full_name || 
                  user.user_metadata?.name || 
                  user.email;

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="프로필 이미지"
            className="w-10 h-10 rounded-full" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        )}
        <span className="font-medium hidden md:block">{fullName}</span>
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
          <div className="px-4 py-2 border-b">
            <p className="font-medium">{fullName}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={16} />
            <span>프로필</span>
          </Link>
          
          <Link 
            href="/orders" 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            <Package size={16} />
            <span>주문 내역</span>
          </Link>
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut size={16} />
            <span>{isLoading ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      )}
    </div>
  );
} 