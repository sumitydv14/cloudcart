'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { useLoginMutation, useSignupMutation } from '@/services/api/authApi';
import { clearAuth, setCredentials, setAuthError } from '@/features/auth/authSlice';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const [loginMutation, loginResult] = useLoginMutation();
  const [signupMutation, signupResult] = useSignupMutation();

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
    } catch (error: any) {
      dispatch(setAuthError(error?.data?.message ?? 'Unable to login.'));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const result = await signupMutation({ name, email, password, role }).unwrap();
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
    } catch (error: any) {
      dispatch(setAuthError(error?.data?.message ?? 'Unable to sign up.'));
      throw error;
    }
  };

  const logout = () => {
    dispatch(clearAuth());
  };

  return useMemo(
    () => ({
      auth,
      login,
      signup,
      logout,
      loginStatus: loginResult.status,
      loginError: loginResult.error,
      signupStatus: signupResult.status,
      signupError: signupResult.error,
    }),
    [auth, loginResult.error, loginResult.status, signupResult.error, signupResult.status],
  );
};

export default useAuth;
