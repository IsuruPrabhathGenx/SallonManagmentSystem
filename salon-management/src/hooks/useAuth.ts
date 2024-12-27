// app/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      return userCredential;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during login');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during logout');
    }
  };

  return { user, loading, login, logout };
};