"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // 장바구니 총액 계산
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.salePrice * item.quantity, 0);
  };

  // 장바구니 아이템 로드
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("장바구니 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // 장바구니 아이템 삭제
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // 이벤트 발생시켜 Navigation에게 변경 알림 (다른 탭에서만 작동하므로 추가로 필요)
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 장바구니 아이템 수량 변경
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // 이벤트 발생시켜 Navigation에게 변경 알림
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 결제 페이지로 이동
  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=checkout');
      return;
    }
    
    router.push('/checkout');
  };

  return (
    <>
      <Navigation cartItems={cartItems.length} />
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-4">장바구니가 비어있습니다</p>
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">주문 상품 ({cartItems.length})</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <Image 
                            src={`https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg`} 
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-semibold">₩{(item.salePrice * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">₩{item.salePrice.toLocaleString()} / 개</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border rounded">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 border-r"
                              >
                                -
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 border-l"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h2 className="text-lg font-medium mb-4">주문 요약</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>소계</span>
                    <span>₩{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                </div>
                <div className="border-t pt-2 mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>총액</span>
                    <span>₩{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 rounded-md"
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 