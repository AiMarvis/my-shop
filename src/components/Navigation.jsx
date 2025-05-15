"use client";

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import UserProfile from './UserProfile';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation({ cartItems = 0 }) {
  const { user, profile, loading } = useAuth();
  const [cartCount, setCartCount] = useState(cartItems);

  // 로컬 스토리지에서 장바구니 정보 가져오기
  useEffect(() => {
    setCartCount(cartItems);
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCartCount(cartData.length);
        }
      } catch (error) {
        console.error('장바구니 데이터 로드 중 오류:', error);
      }
    };
    loadCartFromStorage();
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartFromStorage();
      }
    };
    const handleCartUpdate = () => {
      loadCartFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [cartItems]);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-medium text-lg">
              내 쇼핑몰
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/products" className="text-gray-500 hover:text-gray-900 px-3 py-2">
                상품
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2">
                소개
              </Link>
              {user && profile && profile.role === 'admin' && (
                <Link href="/admin" className="text-gray-500 hover:text-gray-900 px-3 py-2">
                  관리
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-gray-500 hover:text-gray-900 px-3 py-2 relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <UserProfile />
            ) : (
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 