"use client";

import { supabase } from './supabase';

/**
 * 특정 사용자의 프로필 정보를 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<{ profile, error }>} - 프로필 정보와 에러
 */
export async function getUserProfile(userId) {
  try {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { profile: data, error: null };
  } catch (error) {
    console.error('프로필 조회 오류:', error.message);
    return { profile: null, error };
  }
}

/**
 * 현재 로그인한 사용자의 프로필 정보를 업데이트합니다.
 * @param {Object} profileData - 업데이트할 프로필 데이터
 * @returns {Promise<{ success, error }>} - 성공 여부와 에러
 */
export async function updateUserProfile(profileData) {
  try {
    // 현재 사용자 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }
    
    // 업데이트할 데이터에 타임스탬프 추가
    const dataToUpdate = {
      ...profileData,
      updated_at: new Date().toISOString()
    };
    
    // 프로필 업데이트
    const { error } = await supabase
      .from('profiles')
      .update(dataToUpdate)
      .eq('id', user.id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('프로필 업데이트 오류:', error.message);
    return { success: false, error };
  }
}

/**
 * 프로필 테이블에 새 사용자를 추가합니다.
 * @param {Object} userData - 추가할 사용자 데이터
 * @returns {Promise<{ success, error }>} - 성공 여부와 에러
 */
export async function createUserProfile(userData) {
  try {
    if (!userData.id) {
      throw new Error('사용자 ID가 필요합니다.');
    }
    
    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userData.id,
          email: userData.email,
          full_name: userData.user_metadata?.full_name || userData.user_metadata?.name,
          avatar_url: userData.user_metadata?.avatar_url,
          provider: 'kakao',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('프로필 생성 오류:', error.message);
    return { success: false, error };
  }
} 