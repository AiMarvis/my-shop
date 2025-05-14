import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  console.log('Auth 콜백 호출됨:', requestUrl.href);
  console.log('Code:', code);
  
  if (error) {
    console.error('Auth 오류:', error, error_description);
    // 오류 발생 시 오류 정보와 함께 홈으로 리디렉션
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`, 
      requestUrl.origin)
    );
  }
  
  if (code) {
    try {
      // 하드코딩된 값 사용
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plsehlsawmcavjrxevyg.supabase.co';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2VobHNhd21jYXZqcnhldnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjk0MDUsImV4cCI6MjA2MjgwNTQwNX0.pvfF1LhZYE_ZMNpmI_ESXAWMnt8SLxivID4QGh3p2e8';
      
      console.log('Supabase URL:', supabaseUrl);
      console.log('Auth 코드 교환 시도 중...');
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('세션 교환 오류:', sessionError);
        return NextResponse.redirect(
          new URL(`/?error=session_exchange&error_description=${encodeURIComponent(sessionError.message)}`, 
          requestUrl.origin)
        );
      }
      
      console.log('세션 교환 성공:', data);
      
      // 사용자 정보 가져오기
      if (data?.session?.user) {
        const user = data.session.user;
        
        // profiles 테이블에 사용자 정보 저장 또는 업데이트
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
            provider: 'kakao',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });
        
        if (upsertError) {
          console.error('프로필 저장 오류:', upsertError);
        } else {
          console.log('프로필 정보가 성공적으로 저장되었습니다.');
        }
      }
    } catch (err) {
      console.error('예상치 못한 오류:', err);
      return NextResponse.redirect(
        new URL(`/?error=unexpected&error_description=${encodeURIComponent(err.message)}`, 
        requestUrl.origin)
      );
    }
  }

  // 로그인 후 리디렉션할 페이지
  console.log('홈으로 리디렉션...');
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 