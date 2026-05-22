import { fetchBaseQuery, type BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { setCredentials, clearAuth } from '@/features/auth/authSlice';
import type { AuthResponse } from '@/types/auth';

let refreshing = false;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

type BaseQueryArg = Parameters<typeof baseQuery>[0];
type BaseQueryExtraOptions = Parameters<typeof baseQuery>[2];

const baseQueryWithReauth = async (
  args: BaseQueryArg,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshing) {
      refreshing = true;
      const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
      refreshing = false;

      if (refreshResult && 'data' in refreshResult && refreshResult.data) {
        const data = refreshResult.data as AuthResponse;
        api.dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    } else {
      while (refreshing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default baseQueryWithReauth;
