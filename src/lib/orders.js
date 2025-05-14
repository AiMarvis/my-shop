"use client";

import { supabase } from './supabase';

/**
 * 주문 생성 함수
 * @param {Object} orderData - 주문 데이터 객체
 * @param {Array} orderData.items - 주문 상품 목록
 * @param {number} orderData.total - 주문 총액
 * @param {Object} orderData.shippingInfo - 배송 정보
 * @param {string} orderData.userId - 사용자 ID
 * @returns {Promise} - 생성된 주문 정보
 */
export async function createOrder(orderData) {
  try {
    // 1. 주문 기본 정보 저장
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        total_amount: orderData.total,
        shipping_name: orderData.shippingInfo.name,
        shipping_phone: orderData.shippingInfo.phone,
        shipping_address: orderData.shippingInfo.address,
        payment_method: orderData.shippingInfo.payment,
        status: 'pending' // 초기 상태: 대기중
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. 주문 상품 항목 저장
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.salePrice,
      total: item.salePrice * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error('주문 생성 오류:', error);
    throw error;
  }
}

/**
 * 사용자의 주문 내역 조회
 * @param {string} userId - 사용자 ID
 * @returns {Promise} - 사용자의 주문 목록
 */
export async function getUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    throw error;
  }
}

/**
 * 특정 주문 조회
 * @param {string} orderId - 주문 ID
 * @returns {Promise} - 주문 상세 정보
 */
export async function getOrderDetails(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('주문 상세 조회 오류:', error);
    throw error;
  }
}

/**
 * 주문 상태 업데이트
 * @param {string} orderId - 주문 ID
 * @param {string} status - 새로운 주문 상태
 * @returns {Promise} - 업데이트된 주문 정보
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    throw error;
  }
} 