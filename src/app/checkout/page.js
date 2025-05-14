"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/lib/orders";
import { initializePaymentWidget, requestPayment } from "@/lib/payment";

// 포트원 상점 코드 (환경 변수에서 가져오거나 기본값 사용)
const PORTONE_STORE_CODE = process.env.NEXT_PUBLIC_PORTONE_STORE_CODE || "store-56c35bd6-a8b5-4805-846c-d9c1be268b66";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "카드",
    email: ""
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const paymentWidgetRef = useRef(null);

  useEffect(() => {
    // 비로그인 사용자는 로그인 페이지로 리다이렉트
    if (!user && !loading) {
      router.push('/login?redirect=checkout');
      return;
    }

    // 데이터 로드
    const loadData = () => {
      try {
        // 장바구니에서 온 경우
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

        // '바로구매'에서 온 경우
        const buyItem = localStorage.getItem("buyNow");
        if (buyItem) {
          const parsedItem = JSON.parse(buyItem);
          setBuyNowItem({ ...parsedItem, quantity: 1 });
        }

        // 이메일 자동 설정
        if (user?.email) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 페이지 로드 시 결제 위젯 초기화
    async function initPayment() {
      try {
        const paymentWidget = await initializePaymentWidget(PORTONE_STORE_CODE);
        paymentWidgetRef.current = paymentWidget;
      } catch (error) {
        console.error("결제 위젯 초기화 오류:", error);
      }
    }

    initPayment();
  }, [user, loading, router]);

  // 총액 계산
  const calculateTotal = () => {
    // 바로구매 상품만 있는 경우
    if (buyNowItem && cartItems.length === 0) {
      return buyNowItem.salePrice * buyNowItem.quantity;
    }
    
    // 장바구니 상품만 있는 경우
    return cartItems.reduce((total, item) => total + item.salePrice * item.quantity, 0);
  };

  // 결제 아이템 (바로구매 또는 장바구니 아이템)
  const getOrderItems = () => {
    if (buyNowItem) {
      return [buyNowItem];
    }
    return cartItems;
  };

  // 주문 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 간단한 폼 검증
    if (!formData.name || !formData.phone || !formData.address) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!paymentWidgetRef.current) {
      alert('결제 모듈이 초기화되지 않았습니다. 페이지를 새로고침 해주세요.');
      return;
    }
    
    setPaymentLoading(true);
    
    try {
      // 주문 정보
      const orderData = {
        items: getOrderItems(),
        total: calculateTotal(),
        shippingInfo: formData,
        orderDate: new Date().toISOString(),
        userId: user.id,
        payment_status: 'ready'  // 결제 대기 상태로 초기 설정
      };
      
      // 1. 주문 생성 (결제 전 주문 정보 먼저 저장)
      const order = await createOrder(orderData);
      
      // 2. 결제 요청
      const items = getOrderItems();
      const orderName = items.length > 1 
        ? `${items[0].name} 외 ${items.length - 1}건` 
        : items[0].name;
      
      const paymentData = {
        orderId: order.id,
        orderName: orderName,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        amount: calculateTotal(),
        method: formData.payment
      };
      
      // 결제 요청
      const paymentResult = await requestPayment(paymentData, paymentWidgetRef.current);
      
      // 결제 결과 처리는 requestPayment 함수와 리다이렉트된 complete 페이지에서 진행
    } catch (error) {
      console.error('주문/결제 처리 실패:', error);
      setOrderError(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 주문 완료 화면
  if (orderComplete) {
    return (
      <>
        <Navigation />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 mb-6">주문 내역은 이메일로 발송됩니다.</p>
            <Link 
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md inline-block"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </main>
      </>
    );
  }

  // 주문 오류 화면
  if (orderError) {
    return (
      <>
        <Navigation />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">결제 중 오류가 발생했습니다</h1>
            <p className="text-gray-600 mb-6">다시 시도해주세요.</p>
            <button 
              onClick={() => setOrderError(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 rounded-md inline-block"
            >
              다시 시도하기
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation cartItems={cartItems.length} />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">결제하기</h1>
        
        {loading || paymentLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4">{paymentLoading ? '결제 처리 중...' : '로딩 중...'}</p>
          </div>
        ) : getOrderItems().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">주문할 상품이 없습니다</p>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800"
            >
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-medium mb-4">주문 상품</h2>
                <ul className="divide-y divide-gray-200">
                  {getOrderItems().map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity}개</p>
                        </div>
                        <p className="font-semibold">₩{(item.salePrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>총 결제금액</span>
                    <span>₩{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium mb-4">배송 정보</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input 
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">배송지</label>
                    <textarea 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">결제 방법</label>
                    <select 
                      id="payment"
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="카드">신용/체크카드</option>
                      <option value="계좌이체">계좌이체</option>
                      <option value="휴대폰">휴대폰 결제</option>
                      <option value="무통장">무통장 입금</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    type="submit"
                    disabled={paymentLoading}
                    className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-3 rounded-md font-medium ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {paymentLoading ? '처리 중...' : '결제하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 