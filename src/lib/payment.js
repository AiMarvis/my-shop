"use client";

import { loadPaymentWidget } from "@portone/browser-sdk/v2";
import { supabase } from './supabase';
import { updateOrderStatus } from './orders';

/**
 * 포트원 결제 위젯 초기화
 * @param {string} storeCode - 포트원 상점 코드
 * @returns {Promise<any>} - 초기화된 결제 위젯
 */
export async function initializePaymentWidget(storeCode) {
  try {
    const paymentWidget = await loadPaymentWidget(storeCode, {
      productType: 'SHOPPING',
    });
    return paymentWidget;
  } catch (error) {
    console.error('결제 위젯 초기화 오류:', error);
    throw error;
  }
}

/**
 * 결제 요청 처리
 * @param {Object} paymentData - 결제 데이터
 * @param {Object} paymentWidget - 포트원 결제 위젯
 * @returns {Promise<Object>} - 결제 결과
 */
export async function requestPayment(paymentData, paymentWidget) {
  try {
    // 결제 요청
    const paymentResult = await paymentWidget.requestPayment({
      orderId: paymentData.orderId,
      orderName: paymentData.orderName,
      customerName: paymentData.customerName,
      amount: paymentData.amount,
      currency: 'KRW',
      pgProvider: 'tosspayments',
      method: getPaymentMethod(paymentData.method),
      redirectUrl: `${window.location.origin}/orders/complete`,
      // 추가 옵션
      customerEmail: paymentData.customerEmail,
      customerMobilePhone: paymentData.customerPhone,
      useEscrow: false,
      locale: 'ko', // 한국어 결제창
    });

    // 결제 성공 후 주문 상태 업데이트
    if (paymentResult.success) {
      // 주문 정보 업데이트
      await updateOrderPaymentInfo(paymentData.orderId, {
        payment_id: paymentResult.paymentId,
        payment_status: 'paid',
        payment_method_detail: paymentResult.method,
        paid_at: new Date().toISOString(),
        receipt_url: paymentResult.receiptUrl,
        status: 'paid' // 주문 상태 변경
      });
    }

    return paymentResult;
  } catch (error) {
    console.error('결제 요청 오류:', error);
    
    // 주문 상태 업데이트 (실패)
    if (paymentData.orderId) {
      await updateOrderPaymentInfo(paymentData.orderId, {
        payment_status: 'failed',
        status: 'failed'
      });
    }
    
    throw error;
  }
}

/**
 * 결제 후 주문 정보 업데이트
 * @param {string} orderId - 주문 ID
 * @param {Object} paymentInfo - 결제 정보
 * @returns {Promise<Object>} - 업데이트된 주문 정보
 */
export async function updateOrderPaymentInfo(orderId, paymentInfo) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(paymentInfo)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('주문 결제 정보 업데이트 오류:', error);
    throw error;
  }
}

/**
 * 결제 방법 변환
 * @param {string} method - 앱에서 사용하는 결제 방법
 * @returns {string} - 포트원에서 사용하는 결제 방법 코드
 */
function getPaymentMethod(method) {
  const methodMap = {
    '카드': 'CARD',
    '계좌이체': 'TRANSFER',
    '휴대폰': 'MOBILE_PHONE',
    '무통장': 'VIRTUAL_ACCOUNT'
  };
  
  return methodMap[method] || 'CARD';
} 