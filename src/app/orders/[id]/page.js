"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle, Truck, Package, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { getOrderDetails } from "@/lib/orders";

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const orderId = params.id;

  useEffect(() => {
    // 비로그인 사용자는 로그인 페이지로 리다이렉트
    if (!user && !loading) {
      router.push('/login?redirect=orders');
      return;
    }

    const fetchOrderDetails = async () => {
      if (!user || !orderId) return;
      
      try {
        const orderData = await getOrderDetails(orderId);
        
        // 이 주문이 현재 사용자의 것인지 확인
        if (orderData.user_id !== user.id) {
          router.push('/orders');
          return;
        }
        
        setOrder(orderData);
      } catch (error) {
        console.error("주문 상세 정보 로드 중 오류 발생:", error);
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, loading, router, orderId]);

  // 주문 상태에 따른 아이콘 및 색상
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle className="text-green-500" />, color: 'text-green-500', bg: 'bg-green-50' };
      case 'processing':
        return { icon: <Clock className="text-blue-500" />, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'shipped':
        return { icon: <Truck className="text-purple-500" />, color: 'text-purple-500', bg: 'bg-purple-50' };
      default:
        return { icon: <Package className="text-gray-500" />, color: 'text-gray-500', bg: 'bg-gray-50' };
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
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <Link href="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={16} className="mr-2" />
          주문 목록으로 돌아가기
        </Link>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">주문 #{order.id.slice(0, 8)}</h1>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-2">주문 정보</h2>
                  <p className="mb-1"><span className="font-medium">주문 시간:</span> {formatDate(order.created_at)}</p>
                  <p className="mb-1"><span className="font-medium">주문 상태:</span> {getStatusText(order.status)}</p>
                  <p><span className="font-medium">결제 방법:</span> {order.payment_method}</p>
                </div>
                
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-2">배송 정보</h2>
                  <p className="mb-1"><span className="font-medium">받는 사람:</span> {order.shipping_name}</p>
                  <p className="mb-1"><span className="font-medium">연락처:</span> {order.shipping_phone}</p>
                  <p><span className="font-medium">주소:</span> {order.shipping_address}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">주문 상품 ({order.order_items?.length || 0})</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.order_items?.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          ₩{item.price.toLocaleString()} × {item.quantity}개
                        </p>
                      </div>
                      <p className="font-semibold">₩{item.total.toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="font-medium">총 결제금액</p>
                  <p className="text-xl font-bold">₩{order.total_amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-500">주문 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </main>
    </>
  );
} 