"use client";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/hero-section";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 샘플 이미지 URL
const laptopImages = [
  "https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336378_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/02/02/11/09/office-620822_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/09/24/14/29/macbook-459196_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/05/31/10/55/man-791049_1280.jpg",
];

// 상품 데이터
const products = [
  { id: 1, name: "프리미엄 노트북 1", originalPrice: 1890000, salePrice: 1590000, description: "고성능 노트북으로 업무 효율을 높이세요" },
  { id: 2, name: "프리미엄 노트북 2", originalPrice: 2190000, salePrice: 1890000, description: "고성능 노트북으로 업무 효율을 높이세요" },
  { id: 3, name: "프리미엄 노트북 3", originalPrice: 1650000, salePrice: 1350000, description: "고성능 노트북으로 업무 효율을 높이세요" },
  { id: 4, name: "프리미엄 노트북 4", originalPrice: 1790000, salePrice: 1490000, description: "고성능 노트북으로 업무 효율을 높이세요" },
  { id: 5, name: "프리미엄 노트북 5", originalPrice: 2290000, salePrice: 1790000, description: "고성능 노트북으로 업무 효율을 높이세요" },
  { id: 6, name: "프리미엄 노트북 6", originalPrice: 2590000, salePrice: 1990000, description: "고성능 노트북으로 업무 효율을 높이세요" },
];

// 할인율 계산 함수
const calculateDiscount = (originalPrice, salePrice) => {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 장바구니 정보 로드
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("장바구니 로드 중 오류 발생:", error);
    }
  }, []);
  
  const addToCart = (product) => {
    setCart(prevCart => {
      // 이미 장바구니에 있는지 확인
      const existingItem = prevCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        // 이미 있으면 수량만 증가
        updatedCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // 없으면 새로 추가
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      // 로컬 스토리지에 장바구니 저장
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // 이벤트 발생시켜 Navigation에게 변경 알림
      window.dispatchEvent(new Event('cartUpdated'));
      
      return updatedCart;
    });
    
    // 사용자 피드백 (여기서는 간단히 콘솔로그만)
    console.log(`상품 추가됨: ${product.name}`);
  };
  
  const handleBuyNow = (product) => {
    // 바로 구매 페이지로 이동
    if (!user) {
      router.push('/login?redirect=checkout');
    } else {
      // 현재는 임시로 로컬 스토리지에 정보 저장
      localStorage.setItem('buyNow', JSON.stringify(product));
      router.push('/checkout');
    }
  };
  
  return (
    <>
      <Navigation cartItems={cart.length} />
      <main className="flex flex-col gap-4 lg:gap-12 row-start-2 items-center w-full max-w-6xl mx-auto lg:pt-8 px-2 pt-2">
        <HeroSection />
        
        {user && (
          <div className="w-full bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-green-800 font-medium">
              {user.user_metadata?.full_name || user.email}님, 환영합니다!
            </p>
          </div>
        )}
        
        <div className="w-full py-8">
          <h2 className="text-2xl font-bold mb-6">추천 상품</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const discountPercent = calculateDiscount(product.originalPrice, product.salePrice);
              
              return (
                <Card 
                  key={product.id} 
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className="h-48 bg-muted relative overflow-hidden group">
                    <Image 
                      src={laptopImages[product.id-1]} 
                      alt={`노트북 ${product.id}`} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
                    
                    {/* 할인율 배지 */}
                    {discountPercent > 0 && (
                      <Badge 
                        variant="discount" 
                        className="absolute top-3 right-3 font-bold text-sm px-2.5 py-1 animate-in fade-in slide-in-from-top-5 duration-300"
                      >
                        {discountPercent}% 할인
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">최신 프로세서와 그래픽 카드 탑재, SSD 저장 장치</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="font-semibold text-lg">₩{product.salePrice.toLocaleString()}</p>
                        {discountPercent > 0 && (
                          <p className="text-sm line-through text-muted-foreground">
                            ₩{product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-3 py-2 rounded-md text-sm"
                        >
                          장바구니
                        </button>
                        <button 
                          onClick={() => handleBuyNow(product)}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors px-3 py-2 rounded-md text-sm"
                        >
                          바로구매
                        </button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
