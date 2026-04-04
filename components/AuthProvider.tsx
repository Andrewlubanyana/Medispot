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

  const clearAuth = useCallback(() => {
    setUser(null);
    setProfile(null);
    setDoctorRecord(null);
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data as Profile);

        if (data.role === "doctor") {
          const { data: doc, error: docError } = await supabase
            .from("doctors")
            .select(
              "id, full_name, specialty, is_approved, is_premium, is_verified, practice_name"
            )
            .eq("profile_id", userId)
            .single();

          if (!docError && doc) {
            setDoctorRecord(doc as DoctorRecord);
          }
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  }, []);

  const refreshDoctorRecord = useCallback(async () => {
    if (!user) return;
    try {
      const { data: doc } = await supabase
        .from("doctors")
        .select(
          "id, full_name, specialty, is_approved, is_premium, is_verified, practice_name"
        )
        .eq("profile_id", user.id)
        .single();
      setDoctorRecord(doc as DoctorRecord | null);
    } catch (err) {
      console.error("Error refreshing doctor record:", err);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          
          // If session is invalid, sign out cleanly
          if (error.message?.includes("refresh_token") || 
              error.message?.includes("invalid") ||
              error.message?.includes("expired")) {
            await supabase.auth.signOut();
            if (mounted) clearAuth();
          }
          
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        // Clear any broken session
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore sign out errors
        }
        if (mounted) clearAuth();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        clearAuth();
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
      } else if (event === "TOKEN_REFRESHED" && !session) {
        // Token refresh failed — session is dead
        clearAuth();
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, clearAuth]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (err) {
      console.error("Sign in error:", err);
      return { error: "Something went wrong. Please try again." };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });
      return { error: error?.message || null, userId: data.user?.id };
    } catch (err) {
      console.error("Sign up error:", err);
      return { error: "Something went wrong. Please try again." };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    clearAuth();
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
