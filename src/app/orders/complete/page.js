"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { updateOrderPaymentInfo } from "@/lib/payment";

export default function PaymentCompletePage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function processPaymentResult() {
      try {
        // URL에서 파라미터 추출
        const paymentId = searchParams.get("paymentId");
        const paymentStatus = searchParams.get("status");
        const orderIdFromQuery = searchParams.get("orderId");
        
        setOrderId(orderIdFromQuery);

        // 결제 성공 여부 확인
        if (paymentStatus === "success" && paymentId && orderIdFromQuery) {
          // Supabase 주문 정보 업데이트
          await updateOrderPaymentInfo(orderIdFromQuery, {
            payment_id: paymentId,
            payment_status: "paid",
            status: "paid",
            paid_at: new Date().toISOString()
          });
          
          // 장바구니 비우기
          localStorage.removeItem('cart');
          localStorage.removeItem('buyNow');
          
          setSuccess(true);
        } else {
          // 결제 실패 처리
          if (orderIdFromQuery) {
            await updateOrderPaymentInfo(orderIdFromQuery, {
              payment_status: "failed",
              status: "failed"
            });
          }
          setSuccess(false);
        }
      } catch (error) {
        console.error("결제 완료 처리 오류:", error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }

    processPaymentResult();
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4">결제 완료 중입니다...</p>
          </div>
        </main>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navigation />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
            <p className="text-gray-600 mb-6">주문이 성공적으로 처리되었습니다.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {orderId && (
                <Link 
                  href={`/orders/${orderId}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md"
                >
                  주문 상세 보기
                </Link>
              )}
              
              <Link 
                href="/orders"
                className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors px-6 py-2 rounded-md"
              >
                주문 목록으로
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">결제에 실패했습니다</h1>
          <p className="text-gray-600 mb-6">결제 과정에서 문제가 발생했습니다.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => router.push('/checkout')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md"
            >
              다시 시도하기
            </button>
            
            <Link 
              href="/"
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors px-6 py-2 rounded-md"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 