import { serviceApi } from './serviceApi';
import { AuthResponse, LoginPayload, SignupPayload } from '@/types/auth';

export const authApi = serviceApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: build.mutation<AuthResponse, SignupPayload>({
      query: payload => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
