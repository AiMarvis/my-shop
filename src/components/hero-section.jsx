"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  // 가격 정보
  const originalPrice = 1890000;
  const salePrice = 1590000;
  
  // 할인율 계산
  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop"
          alt="노트북 이미지"
          fill
          className="object-cover"
          priority
        />
        {/* 이미지 위에 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>
      
      {/* 텍스트 콘텐츠 */}
      <div className="relative z-20 flex flex-col items-start justify-end h-full p-6 md:p-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase bg-primary rounded-full">
              신제품
            </span>
            <Badge 
              variant="discount" 
              className="font-bold text-sm px-2.5 py-1.5"
            >
              {discountPercent}% 할인
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            최신 프리미엄 노트북
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/80 mb-4 max-w-lg">
            뛰어난 성능과 세련된 디자인을 갖춘 노트북으로 업무 생산성을 높이세요. 
            어디서든 빠르고 효율적인 작업 환경을 경험하실 수 있습니다.
          </p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">₩{salePrice.toLocaleString()}</span>
            <span className="text-base md:text-lg line-through text-white/60">₩{originalPrice.toLocaleString()}</span>
          </div>
          <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-primary font-medium text-base md:text-lg rounded-md hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            지금 구매하기
          </button>
        </div>
      </div>
    </div>
  );
} 