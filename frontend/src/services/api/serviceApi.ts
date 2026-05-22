import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Cart', 'Orders', 'Auth'],
  endpoints: () => ({}),
});
