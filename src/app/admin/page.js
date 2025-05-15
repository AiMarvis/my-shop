"use client";

import Link from 'next/link';

// 각 관리 섹션으로 이동하는 카드 컴포넌트 (아이콘 없는 버전)
const AdminFeatureCard = ({ title, description, href }) => {
  return (
    <Link href={href} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition-colors">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default function AdminPage() {
  // 여기에 실제 통계 데이터를 가져오는 로직을 추가할 수 있습니다.
  const summaryStats = {
    totalSales: 1250000, // 예시 데이터
    newOrders: 15,
    activeUsers: 350,
    totalProducts: 88,
    operatingMonths: 12, // 운영 개월 수 (예시)
  };

  // 월 평균 매출 계산
  const averageMonthlySales = summaryStats.totalSales / summaryStats.operatingMonths;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">쇼핑몰의 주요 지표와 관리 기능을 확인하세요.</p>
      </div>

      {/* 요약 통계 섹션 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">총 매출액</h3>
          <p className="text-3xl font-bold mt-1">₩{summaryStats.totalSales.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">신규 주문</h3>
          <p className="text-3xl font-bold mt-1">{summaryStats.newOrders}건</p>
        </div>
        <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">활성 사용자</h3>
          <p className="text-3xl font-bold mt-1">{summaryStats.activeUsers}명</p>
        </div>
        <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">총 상품 수</h3>
          <p className="text-3xl font-bold mt-1">{summaryStats.totalProducts}개</p>
        </div>
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">월 평균 매출 (추정)</h3>
          <p className="text-3xl font-bold mt-1">₩{averageMonthlySales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </section>

      {/* 관리 기능 링크 섹션 */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">주요 관리 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminFeatureCard
            title="상품 관리"
            description="상품 등록, 수정, 삭제 및 재고 관리를 할 수 있습니다."
            href="/admin/products"
          />
          <AdminFeatureCard
            title="주문 관리"
            description="고객 주문 내역 확인 및 주문 상태를 변경합니다."
            href="/admin/orders"
          />
          <AdminFeatureCard
            title="사용자 관리"
            description="회원 정보 조회, 역할 변경 등을 관리합니다."
            href="/admin/users"
          />
          <AdminFeatureCard
            title="사이트 설정"
            description="쇼핑몰 기본 정보, 결제 설정 등을 관리합니다."
            href="/admin/settings"
          />
          <AdminFeatureCard
            title="통계 및 보고서"
            description="상세 매출 통계, 방문자 분석 등을 확인합니다."
            href="/admin/stats"
          />
        </div>
      </section>
    </main>
  );
} 