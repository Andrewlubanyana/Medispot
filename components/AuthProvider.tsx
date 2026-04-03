"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
}

interface DoctorRecord {
  id: string;
  full_name: string;
  specialty: string;
  is_approved: boolean;
  is_premium: boolean;
  is_verified: boolean;
  practice_name: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  doctorRecord: DoctorRecord | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => Promise<{ error: string | null; userId?: string }>;
  signOut: () => Promise<void>;
  refreshDoctorRecord: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  doctorRecord: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshDoctorRecord: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [doctorRecord, setDoctorRecord] = useState<DoctorRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data as Profile);

      if (data.role === "doctor") {
        const { data: doc } = await supabase
          .from("doctors")
          .select("id, full_name, specialty, is_approved, is_premium, is_verified, practice_name")
          .eq("profile_id", userId)
          .single();

        setDoctorRecord(doc as DoctorRecord | null);
      }
    }
  }, []);

  const refreshDoctorRecord = useCallback(async () => {
    if (!user) return;
    const { data: doc } = await supabase
      .from("doctors")
      .select("id, full_name, specialty, is_approved, is_premium, is_verified, practice_name")
      .eq("profile_id", user.id)
      .single();
    setDoctorRecord(doc as DoctorRecord | null);
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setDoctorRecord(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message || null };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    return { error: error?.message || null, userId: data.user?.id };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setDoctorRecord(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        doctorRecord,
        loading,
        signIn,
        signUp,
        signOut,
        refreshDoctorRecord,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}