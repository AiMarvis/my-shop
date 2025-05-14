"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getUserOrders } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // 비로그인 사용자는 로그인 페이지로 리다이렉트
    if (!user && !loading) {
      router.push('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("주문 내역 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, loading, router]);

  // 주문 상태에 따른 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 주문 상태 한글 변환
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '결제 대기';
      case 'processing':
        return '처리중';
      case 'shipped':
        return '배송중';
      case 'completed':
        return '배송 완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  // 날짜 형식 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">나의 주문</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-4">주문 내역이 없습니다.</p>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800"
            >
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">주문 내역 ({orders.length})</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <Link href={`/orders/${order.id}`} className="block">
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
                          <Package size={24} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">주문 #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="font-semibold mr-2">₩{order.total_amount.toLocaleString()}</p>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
} 