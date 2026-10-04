import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../firebase/config";
import { UserProfile } from "../types";

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, institution?: string, subjectArea?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  loginAsDemoTeacher: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_EMAIL = "patrickjr2004@gmail.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile from Firestore or generate default
  async function loadOrCreateProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const userDocRef = doc(db, "users", fbUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        return data;
      } else {
        const isAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const newProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "Professor(a)",
          email: fbUser.email || "",
          institution: "Ensino Médio Público / Estadual",
          subjectArea: "Geral",
          role: isAdmin ? "admin" : "teacher",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(userDocRef, newProfile);
        } catch (e) {
          console.warn("Could not save initial user doc:", e);
        }

        setProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn("Profile fetch error, using memory profile:", err);
      const fallbackProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split("@")[0] || "Professor(a)",
        email: fbUser.email || "",
        institution: "Ensino Médio",
        subjectArea: "Geral",
        role: fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "teacher",
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadOrCreateProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await loadOrCreateProfile(result.user);
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await loadOrCreateProfile(result.user);
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string, institution?: string, subjectArea?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const newProfile: UserProfile = {
        id: result.user.uid,
        name: name.trim(),
        email: email.trim(),
        institution: institution?.trim() || "Ensino Médio",
        subjectArea: subjectArea?.trim() || "Geral",
        role: isAdmin ? "admin" : "teacher",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, "users", result.user.uid), newProfile);
      } catch (e) {
        console.warn("Could not save profile doc:", e);
      }
      setProfile(newProfile);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    if (user) {
      try {
        await setDoc(doc(db, "users", profile.id), updated, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${profile.id}`);
      }
    }
  };

  const loginAsDemoTeacher = () => {
    const demoProf: UserProfile = {
      id: "demo-teacher-uid",
      name: "Prof. Helena Vasconcelos",
      email: "helena.vasconcelos@escola.edu.br",
      institution: "E.E. Cecília Meireles (Ensino Médio)",
      subjectArea: "Linguagens e Redação",
      role: "teacher",
      createdAt: new Date().toISOString(),
    };
    setProfile(demoProf);
  };

  const isAdmin = Boolean(
    profile?.role === "admin" ||
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        updateProfileData,
        loginAsDemoTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
