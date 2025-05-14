"use client";

import { supabase } from './supabase';

/**
 * 카카오 로그인 함수
 * Supabase Auth를 통해 카카오 소셜 로그인을 처리합니다.
 */
export async function signInWithKakao() {
  try {
    console.log('카카오 로그인 시도...');
    console.log('현재 경로:', window.location.origin);
    console.log('리다이렉트 URL:', `${window.location.origin}/auth/callback`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('카카오 로그인 오류 발생:', error);
      throw error;
    }

    console.log('카카오 로그인 성공:', data);
    return { data, error: null };
  } catch (error) {
    console.error('카카오 로그인 오류:', error.message);
    return { data: null, error };
  }
}

/**
 * 로그아웃 함수
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    console.error('로그아웃 오류:', error.message);
    return { error };
  }
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return { user, error: null };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error.message);
    return { user: null, error };
  }
} 