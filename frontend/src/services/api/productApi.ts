import { serviceApi } from './serviceApi';
import { Product, ProductListParams } from '@/types/product';

export const productApi = serviceApi.injectEndpoints({
  endpoints: build => ({
    fetchProducts: build.query<Product[], ProductListParams>({
      query: ({ page = 1, filters = {} }) => ({
        url: '/products',
        params: { page, ...filters },
      }),
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products' as const, id })), { type: 'Products' as const, id: 'LIST' }]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),
    fetchProductBySlug: build.query<Product, string>({
      query: slug => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Products' as const, id: slug }],
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductBySlugQuery } = productApi;
