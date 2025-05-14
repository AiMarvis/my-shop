"use client";

import { createClient } from '@supabase/supabase-js';

// 하드코딩된 값을 폴백으로 사용
const FALLBACK_SUPABASE_URL = 'https://plsehlsawmcavjrxevyg.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2VobHNhd21jYXZqcnhldnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjk0MDUsImV4cCI6MjA2MjgwNTQwNX0.pvfF1LhZYE_ZMNpmI_ESXAWMnt8SLxivID4QGh3p2e8';

// 브라우저/클라이언트 환경에서만 환경 변수에 접근 시도
function getSupabaseClient() {
  // 클라이언트 사이드에서 실행 중인지 확인
  const isClient = typeof window !== 'undefined';
  
  let supabaseUrl = FALLBACK_SUPABASE_URL;
  let supabaseAnonKey = FALLBACK_SUPABASE_ANON_KEY;
  
  // 클라이언트 사이드에서만 환경 변수 접근
  if (isClient) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient(); 