import { createContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase/config";

export const AuthContext = createContext(null);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    setFirebaseUser(null);
    setDbUser(null);
    setToken("");
  };

  const syncWithBackend = async (user, selectedRole = "usuario") => {
    const idToken = await user.getIdToken(true);
    setToken(idToken);

    const response = await axios.post(
      `${API_URL}/auth/sync`,
      { role: selectedRole },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const backendUser = response.data?.data || null;
    setDbUser(backendUser);

    return backendUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          clearSession();
          setLoading(false);
          return;
        }

        setFirebaseUser(user);

        // Por defecto, cualquier cuenta Google entra como usuario
        await syncWithBackend(user, "usuario");
      } catch (error) {
        console.error("Error sincronizando usuario:", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (selectedRole = "usuario") => {
    const result = await signInWithPopup(auth, provider);
    setFirebaseUser(result.user);

    const backendUser = await syncWithBackend(result.user, selectedRole);
    return backendUser;
  };

  const logout = async () => {
    await signOut(auth);
    clearSession();
  };

  const value = useMemo(
    () => ({
      firebaseUser,
      dbUser,
      token,
      loading,
      isAuthenticated: !!firebaseUser,
      loginWithGoogle,
      logout,
    }),
    [firebaseUser, dbUser, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}