"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabase';
import { getUserProfile } from './profile';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 프로필 정보 가져오기
  const fetchProfile = async (userId) => {
    if (!userId) return;
    
    try {
      const { profile, error } = await getUserProfile(userId);
      if (error) {
        console.error('프로필 로드 오류:', error);
        return;
      }
      
      setProfile(profile);
    } catch (err) {
      console.error('프로필 데이터 로드 중 오류:', err);
    }
  };

  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data?.session?.user || null;
        setUser(currentUser);
        
        // 사용자가 있으면 프로필 정보 가져오기
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error('세션 확인 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 인증 상태 변경 이벤트 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        // 사용자가 변경되면 프로필 정보도 다시 가져오기
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 