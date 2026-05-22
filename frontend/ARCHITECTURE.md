# CloudCart Frontend Architecture

This document defines the production-grade scalable frontend architecture for CloudCart, a cloud-native e-commerce platform built with Next.js 15, React, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, React Hook Form, Zod, Framer Motion, Axios, and JWT authentication.

---

## 1. Architecture Summary

CloudCart frontend is designed as an enterprise-level application with:
- Feature-based architecture for clear ownership and scalability.
- Modular state management using Redux Toolkit and RTK Query.
- Strong separation between domain features, shared UI components, layout primitives, and app plumbing.
- Secure authentication flow with JWT access tokens and refresh tokens.
- Route protection, RBAC, and session persistence.
- Responsive and accessible UI patterns.
- Performance-first rendering strategy using Next.js App Router, server components for static content, and client components for interaction.
- Production readiness for Docker, AWS deployment, and CloudFront optimization.

---

## 2. Complete Folder Structure

```
frontend/
  ├── ARCHITECTURE.md
  ├── next.config.mjs
  ├── package.json
  ├── tsconfig.json
  ├── tailwind.config.ts
  ├── postcss.config.js
  ├── public/
  │   ├── icons/
  │   ├── images/
  │   └── favicon.ico
  ├── src/
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx
  │   │   ├── globals.css
  │   │   ├── loading.tsx
  │   │   ├── error.tsx
  │   │   ├── dashboard/
  │   │   │   ├── page.tsx
  │   │   │   ├── layout.tsx
  │   │   │   └── error.tsx
  │   │   ├── auth/
  │   │   │   ├── login/page.tsx
  │   │   │   └── signup/page.tsx
  │   │   ├── products/
  │   │   │   ├── page.tsx
  │   │   │   ├── [slug]/page.tsx
  │   │   │   └── search/page.tsx
  │   │   ├── cart/
  │   │   │   └── page.tsx
  │   │   ├── checkout/
  │   │   │   └── page.tsx
  │   │   ├── orders/
  │   │   │   └── page.tsx
  │   │   ├── profile/
  │   │   │   └── page.tsx
  │   │   └── admin/
  │   │       ├── products/page.tsx
  │   │       ├── orders/page.tsx
  │   │       └── users/page.tsx
  │   ├── components/
  │   │   ├── ui/
  │   │   │   ├── Button.tsx
  │   │   │   ├── Input.tsx
  │   │   │   ├── Select.tsx
  │   │   │   ├── Modal.tsx
  │   │   │   ├── Drawer.tsx
  │   │   │   ├── Badge.tsx
  │   │   │   ├── Spinner.tsx
  │   │   │   ├── Skeleton.tsx
  │   │   │   ├── Table.tsx
  │   │   │   ├── Pagination.tsx
  │   │   │   ├── Toast.tsx
  │   │   │   └── Tabs.tsx
  │   │   ├── layout/
  │   │   │   ├── Header.tsx
  │   │   │   ├── Footer.tsx
  │   │   │   ├── Sidebar.tsx
  │   │   │   └── AuthGuard.tsx
  │   │   ├── cards/
  │   │   │   ├── ProductCard.tsx
  │   │   │   ├── OrderCard.tsx
  │   │   │   └── StatsCard.tsx
  │   │   ├── forms/
  │   │   │   ├── FormField.tsx
  │   │   │   ├── PasswordInput.tsx
  │   │   │   └── FileUpload.tsx
  │   │   └── navigation/
  │   │       ├── Breadcrumbs.tsx
  │   │       └── TabNav.tsx
  │   ├── features/
  │   │   ├── auth/
  │   │   │   ├── components/
  │   │   │   │   ├── AuthForm.tsx
  │   │   │   │   ├── OAuthButtons.tsx
  │   │   │   │   └── PasswordReset.tsx
  │   │   │   ├── hooks/
  │   │   │   │   ├── useAuth.ts
  │   │   │   │   └── useRequireAuth.ts
  │   │   │   ├── schemas.ts
  │   │   │   └── authSlice.ts
  │   │   ├── product/
  │   │   │   ├── components/
  │   │   │   │   ├── ProductFilters.tsx
  │   │   │   │   ├── ProductGrid.tsx
  │   │   │   │   └── ProductDetailPanel.tsx
  │   │   │   └── productSlice.ts
  │   │   ├── cart/
  │   │   │   ├── components/
  │   │   │   │   ├── CartItem.tsx
  │   │   │   │   ├── MiniCart.tsx
  │   │   │   │   └── CartSummary.tsx
  │   │   │   └── cartSlice.ts
  │   │   ├── checkout/
  │   │   │   ├── components/
  │   │   │   │   ├── CheckoutForm.tsx
  │   │   │   │   ├── PaymentMethodSelect.tsx
  │   │   │   │   └── OrderReview.tsx
  │   │   │   └── checkoutSlice.ts
  │   │   ├── order/
  │   │   │   ├── components/
  │   │   │   │   ├── OrderHistoryList.tsx
  │   │   │   │   └── OrderDetail.tsx
  │   │   │   └── orderSlice.ts
  │   │   ├── profile/
  │   │   │   ├── components/
  │   │   │   │   ├── ProfileForm.tsx
  │   │   │   │   └── AddressBook.tsx
  │   │   │   └── profileSlice.ts
  │   │   └── admin/
  │   │       ├── components/
  │   │       │   ├── ProductAdminTable.tsx
  │   │       │   ├── OrderAdminTable.tsx
  │   │       │   └── UserAdminTable.tsx
  │   │       └── adminSlice.ts
  │   ├── services/
  │   │   ├── api/
  │   │   │   ├── baseApi.ts
  │   │   │   ├── authApi.ts
  │   │   │   ├── productApi.ts
  │   │   │   ├── cartApi.ts
  │   │   │   ├── orderApi.ts
  │   │   │   └── paymentApi.ts
  │   │   └── axios/
  │   │       └── axiosClient.ts
  │   ├── store/
  │   │   ├── index.ts
  │   │   ├── rootReducer.ts
  │   │   ├── store.ts
  │   │   └── middleware.ts
  │   ├── hooks/
  │   │   ├── useDebounce.ts
  │   │   ├── useMediaQuery.ts
  │   │   ├── useToast.ts
  │   │   ├── useScrollRestoration.ts
  │   │   └── useOnClickOutside.ts
  │   ├── layouts/
  │   │   ├── MainLayout.tsx
  │   │   ├── AuthLayout.tsx
  │   │   ├── DashboardLayout.tsx
  │   │   └── AdminLayout.tsx
  │   ├── lib/
  │   │   ├── auth/
  │   │   │   ├── jwt.ts
  │   │   │   ├── session.ts
  │   │   │   └── permissions.ts
  │   │   ├── analytics.ts
  │   │   ├── env.ts
  │   │   └── i18n.ts
  │   ├── utils/
  │   │   ├── formatters.ts
  │   │   ├── validators.ts
  │   │   ├── errorMapper.ts
  │   │   └── constants.ts
  │   ├── providers/
  │   │   ├── ReduxProvider.tsx
  │   │   ├── ThemeProvider.tsx
  │   │   └── ToastProvider.tsx
  │   ├── middleware/
  │   │   ├── authMiddleware.ts
  │   │   └── loggerMiddleware.ts
  │   ├── styles/
  │   │   ├── globals.css
  │   │   ├── tailwind.css
  │   │   └── theme.css
  │   ├── constants/
  │   │   ├── routes.ts
  │   │   ├── roles.ts
  │   │   └── api.ts
  │   ├── types/
  │   │   ├── auth.ts
  │   │   ├── product.ts
  │   │   ├── cart.ts
  │   │   ├── order.ts
  │   │   └── ui.ts
  │   └── config/
  │       ├── apiConfig.ts
  │       ├── featureFlags.ts
  │       └── appConfig.ts
  └── tests/
      ├── unit/
      └── integration/
```

### Why each folder exists

- `app/`: Next.js App Router pages and nested layouts, the entry point for server and client rendering.
- `components/`: UI primitives and shared design system elements reusable across features.
- `features/`: Domain-specific functionality organized by business capability.
- `services/`: Encapsulates API clients, HTTP wrappers, and network concerns.
- `store/`: Redux store setup, root reducer, middleware, and typed store hooks.
- `hooks/`: Shared custom hooks for reusable component logic and UX behaviors.
- `layouts/`: Page scaffolds and route-level composition patterns.
- `lib/`: Low-level platform utilities, auth helpers, and environment abstractions.
- `utils/`: Generic helpers, mappers, and constants not tied to business domains.
- `providers/`: Context providers for app-level services like theme and notifications.
- `middleware/`: Redux middleware and cross-cutting logic like auth or logging.
- `styles/`: Tailwind and global CSS entrypoints.
- `constants/`: Named route and domain constants for consistency.
- `types/`: Strong TypeScript interfaces and domain models.
- `config/`: Runtime configuration and environment-specific settings.
- `tests/`: Unit and integration tests organized by scope.

---

## 3. Routing Architecture

### Route structure

- `/` — Home page
- `/products` — Product listing
- `/products/[slug]` — Product detail
- `/products/search` — Search and filters
- `/auth/login` — Login
- `/auth/signup` — Signup
- `/cart` — Shopping cart
- `/checkout` — Checkout flow
- `/orders` — Order history
- `/profile` — User profile
- `/dashboard` — Admin dashboard
- `/dashboard/products` — Product management
- `/dashboard/orders` — Order management
- `/dashboard/users` — User management

### Layout strategy

- `app/layout.tsx`: root layout with global providers and metadata.
- `MainLayout`: public storefront layout with header/footer and cart preview.
- `AuthLayout`: minimal layout for login/signup.
- `DashboardLayout`: authenticated user layout with sidebar.
- `AdminLayout`: role-based dashboard layout with admin nav.

### Route protection

- Public pages are server-rendered where appropriate.
- Protected pages use an `AuthGuard` client component to verify session.
- Admin routes require `roles.admin` claims.
- Route metadata is defined in `constants/routes.ts` and checked by the guard.

---

## 4. Authentication Architecture

### Flow

1. User submits credentials to `/auth/login`.
2. Login form validates input via Zod.
3. Client sends credentials to `authApi.login`.
4. Backend returns `accessToken`, `refreshToken`, and user claims.
5. `accessToken` is stored in memory and a secure `httpOnly` cookie or in-memory store.
6. `refreshToken` is stored in an `httpOnly` cookie or secure storage abstraction.
7. API layer includes `authorization: Bearer <accessToken>` in requests.
8. When the access token expires, the client triggers `authApi.refreshToken` transparently.
9. On refresh success, the store updates tokens. On refresh failure, user is logged out.
10. Role claims are used for RBAC and UI feature gating.

### Security

- Use `httpOnly`, `Secure`, `SameSite=Strict` cookies for refresh tokens.
- Keep access tokens in memory when possible.
- Perform token rotation on every refresh.
- Auto logout on invalid token or refresh failure.
- Protect routes with server-side guards for initial navigation and client-side guards for dynamic access.

### Authentication artifacts

- `authSlice.ts` — stores `user`, `accessToken`, roles, `isAuthenticated`, `authStatus`.
- `authApi.ts` — RTK Query API endpoints for login, signup, refresh, logout, and profile.
- `useAuth.ts` — reusable hook exposing `login`, `logout`, `refreshSession`, and role checks.
- `jwt.ts` — token utilities to decode expiration and extract claims.
- `permissions.ts` — maps roles to allowed page groups and components.

---

## 5. State Management Architecture

### Why Redux Toolkit

- Reduces boilerplate with `createSlice`, `createAsyncThunk`, and readable reducers.
- Provides immutable updates through Immer.
- Works well with TypeScript and enterprise codebases.
- Encourages feature-based slices and clear domain boundaries.

### Why RTK Query

- Built-in caching, invalidation, and request lifecycle management.
- Reduces manual fetch logic and request state handling.
- Supports optimistic updates, polling, and re-fetch behavior.
- Simplifies API modularization and endpoint composition.

### Store architecture

- `store.ts`: configures the store with slices and middleware.
- `rootReducer.ts`: combines feature reducers.
- `middleware.ts`: includes auth middleware, logger, and RTK Query middleware.
- `ReduxProvider.tsx`: wraps the app with provider and typed hooks.

### Slice architecture

- `authSlice.ts` — auth state: `user`, `token`, `status`, `roles`, `error`.
- `cartSlice.ts` — cart state: `items`, `subtotal`, `discounts`, `status`.
- `productSlice.ts` — UI-only product state: active filters, sort options, user selections.
- `checkoutSlice.ts` — checkout progress, payment method, shipping info.
- `orderSlice.ts` — order history, current order, status.
- `profileSlice.ts` — user settings, addresses, preferences.
- `adminSlice.ts` — admin UI state like selected management tab, bulk actions.

### API service architecture

- `baseApi.ts`: RTK Query base service with fetch base query and interceptors.
- `authApi.ts`: authentication endpoints.
- `productApi.ts`: product listing, details, search.
- `cartApi.ts`: cart operations.
- `orderApi.ts`: orders and checkout.
- `paymentApi.ts`: payment methods and session.

### Best practices

- Keep global state minimal: only shared and cross-component state belongs in Redux.
- Use local component state for ephemeral UI state.
- Prefer normalized data shapes for entity lists.
- Use selector memoization for performance.
- Keep side effects in middleware or RTK Query endpoints, not in components.
- Keep feature slices co-located with domain-specific UI.

---

## 6. API Architecture

### Base API setup

- `baseApi.ts` uses `fetchBaseQuery` or custom `axiosBaseQuery`.
- It includes a token injector that reads the current access token.
- It handles refresh logic when a 401 occurs.
- It centralizes base URL, headers, credentials policy, and error formatting.

### Token interceptor

- When a request is made, attach `Authorization: Bearer <accessToken>`.
- If the response is 401, attempt a refresh and retry once.
- If refresh fails, dispatch logout and redirect to login.

### Error handling

- Map backend error payloads to a unified `ApiError` type.
- Expose `errorMapper` for UI messages.
- Use RTK Query `onQueryStarted` for optimistic updates and rollback.
- Use a centralized toast system for global errors.

### Retry strategy

- Retry idempotent GET requests on transient failures.
- Use linear or exponential backoff for network errors.
- Do not retry on authentication or validation failures.

### Modularization

- Separate API files per service to avoid monolithic endpoint configs.
- Keep endpoint definitions close to feature needs.
- Share `baseApi` and `transformResponse` utilities.

---

## 7. UI/UX System

### Reusable components

- Buttons: primary, secondary, ghost, icon, loading states.
- Inputs: text, password, textarea, checkbox, radio, switch.
- Forms: field wrappers with labels, hints, error states.
- Modals & Drawers: accessible keyboard trap, focus management.
- Tables: sortable, paginated, responsive.
- Cards: product, order, summary cards.
- Dropdowns: keyboard accessible with focus styling.
- Pagination: page navigation and infinite scroll support.
- Toasts: transient feedback for success/error.
- Skeleton loaders: layout-preserving placeholders.

### Design principles

- Mobile-first responsive design with Tailwind utility classes.
- Accessible markup using ARIA, semantic HTML, and color contrast.
- Focus-visible styling and keyboard navigation support.
- Dark/light mode support with system preference and user setting.
- Motion sensibly applied with Framer Motion for micro-interactions.

### Layout system

- `Header` includes search, cart preview, login state, and nav.
- `Footer` includes links, newsletter CTA, and policy sections.
- `Sidebar` for admin dashboard navigation.
- `AuthGuard` wraps protected content and shows skeleton while auth resolves.

---

## 8. Frontend Pages

### Public pages

- `Home`: hero, category highlights, featured products, promotions.
- `Product Listing`: search, filters, sort, pagination, quick add.
- `Product Details`: product media, specs, reviews, related items.
- `Login`: accessible sign-in form with validation.
- `Signup`: registration form with profile, password requirements.

### Protected pages

- `Cart`: editable line items, shipping estimate, promo codes.
- `Checkout`: shipping, payment, review, confirmation.
- `Orders`: order history list and status.
- `Profile`: profile update, address book, preferences.

### Admin pages

- `Dashboard`: sales KPIs, recent orders, inventory alerts.
- `Product Management`: product CRUD interface.
- `Order Management`: order status and fulfillment.
- `User Management`: user list and role assignment.

---

## 9. Performance Optimization

### Strategies

- Lazy load non-critical components with `next/dynamic`.
- Use dynamic imports for dashboard modules and admin pages.
- Memoize expensive components with `React.memo`.
- Use `useMemo`/`useCallback` for derived values and event handlers.
- Split code by route and feature.
- Optimize images with Next.js `Image` component.
- Cache API results through RTK Query tag invalidation.
- Use server components for data-heavy public content that does not need client interactivity.
- Render interactive behavior on the client only where needed.

### SSR vs CSR

- Use Server Components for landing pages, product listing, public content, and SEO-critical pages.
- Use Client Components for interactive UI like forms, cart updates, and protected admin features.
- Use CSR for pages that require frequent client-side state, such as checkout and dashboard controls.
- Use SSR/SSG for product pages when SEO and initial content load are priorities.

### Suspense

- Use Suspense boundaries around lazy-loaded components.
- Combine with skeleton loaders for better perceived performance.
- Keep fallback UI consistent with page layout.

---

## 10. Form Handling

### Architecture

- Use React Hook Form for performance and minimal rerenders.
- Use Zod for schema validation and typed form values.
- Co-locate validation schemas with form components.
- Use reusable `FormField` wrappers to standardize label, validation, and error display.

### Example patterns

- `AuthForm` uses `useForm<SignInDto>({ resolver: zodResolver(loginSchema) })`.
- `CheckoutForm` uses nested schema for shipping and payment details.
- `ProfileForm` uses default values from `user` state and watches changes.

### Error handling

- Field errors displayed inline.
- Server-side validation errors mapped to form fields.
- Toast notifications for unexpected API failures.

---

## 11. Error Handling

### Global strategy

- `app/error.tsx` handles route-level rendering failures.
- `ErrorBoundary` component catches runtime render exceptions.
- `ToastProvider` surfaces errors from API calls.
- `errorMapper.ts` maps API error codes to user-friendly messages.

### API errors

- RTK Query returns `error` state to components.
- Use consistent shape: `{ status, data: { message, code, fields? } }`.
- Render fallback UIs on critical page failures.

### Forms

- Zod validation provides typed field errors.
- `react-hook-form` displays a summary and inline errors.
- Prevent submission while invalid and show accessible error announcements.

---

## 12. Security Best Practices

- Sanitize and validate all user input using Zod.
- Protect routes with auth guard and server-side role checks.
- Avoid storing access tokens in localStorage.
- Use secure, same-site cookies for refresh tokens.
- Restrict CORS and only call backend via configured API host.
- Keep secrets out of source control using environment variables.
- Ensure `next.config.mjs` and `app/` do not expose sensitive data.
- Use Content Security Policy at the CDN or app server layer.

---

## 13. Deployment Strategy

### Production build

- Use `next build` and `next export` if using static assets; otherwise `next start` for hybrid apps.
- Use Docker multi-stage build to produce lean production image.
- Use environment variables for API host, analytics, feature flags, and auth domain.
- Build artifacts once per CI run and deploy same image to staging and prod.

### Environment setup

- `NEXT_PUBLIC_API_URL` for the gateway endpoint.
- `NEXT_PUBLIC_FEATURE_FLAGS` for optional features.
- `NODE_ENV=production` for optimized builds.

### Docker support

- Build with `node:20-alpine` base image.
- Copy only `package.json`, `package-lock.json`, `tsconfig.json`, and source files.
- Install dependencies and run `next build`.
- Use `next start` as entrypoint.

### AWS readiness

- Deploy static assets to S3 and serve via CloudFront.
- Use CloudFront for edge caching and TLS termination.
- Configure CDN caching headers for product pages and images.
- Use EKS or ECS for server-side rendered app hosting if SSR is required.
- Use AWS Secrets Manager or Parameter Store for production tokens.

---

## 14. Example Reusable Components

### `Button.tsx`

```tsx
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200',
          variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100',
          size === 'sm' && 'h-10 px-4 text-sm',
          size === 'md' && 'h-12 px-5 text-base',
          size === 'lg' && 'h-14 px-6 text-lg',
          className,
        )}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
```

### `Input.tsx`

```tsx
'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import cn from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-900">
      <span>{label}</span>
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
          error ? 'border-red-500 focus:ring-red-200' : '',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
export default Input;
```

### `Skeleton.tsx`

```tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
);

export default Skeleton;
```

---

## 15. Example Redux Slices

### `authSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { setCredentials, clearAuth, setAuthError } = authSlice.actions;
export default authSlice.reducer;
```

### `cartSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  subtotal: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.subtotal = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);
      state.status = 'succeeded';
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setCartItems, addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

---

## 16. Example RTK Query Setup

### `baseApi.ts`

```ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { AppState } from '@/store';
import { refreshToken } from '@/services/api/authApi';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AppState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        if (refreshResult.data) {
          api.dispatch(refreshToken(refreshResult.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch({ type: 'auth/clearAuth' });
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default baseQueryWithReauth;
```

### `serviceApi.ts`

```ts
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseApi';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Cart', 'Orders', 'Auth'],
  endpoints: () => ({}),
});
```

### `productApi.ts`

```ts
import { serviceApi } from './serviceApi';
import { Product } from '@/types/product';

export const productApi = serviceApi.injectEndpoints({
  endpoints: build => ({
    fetchProducts: build.query<Product[], { page: number; filters?: Record<string, string> }>({
      query: ({ page, filters }) => ({
        url: '/products',
        params: { page, ...filters },
      }),
      providesTags: result =>
        result ? [...result.map(({ id }) => ({ type: 'Products' as const, id })), { type: 'Products', id: 'LIST' }] : [{ type: 'Products', id: 'LIST' }],
    }),
    fetchProduct: build.query<Product, string>({
      query: slug => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Products', id: slug }],
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductQuery } = productApi;
```

---

## 17. Example Protected Routes

### `AuthGuard.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  allowRoles?: string[];
}

const AuthGuard = ({ children, allowRoles = [] }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (allowRoles.length > 0 && user && !allowRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [isAuthenticated, user, allowRoles, router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
```

### Usage in route

```tsx
// app/cart/page.tsx

import AuthGuard from '@/components/layout/AuthGuard';
import CartPageContent from '@/features/cart/components/CartPageContent';

const CartPage = () => (
  <AuthGuard>
    <CartPageContent />
  </AuthGuard>
);

export default CartPage;
```

---

## 18. Example Form Validation Setup

### `schemas.ts`

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm your password'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ path: ['confirmPassword'], message: 'Passwords must match', code: 'custom' });
  }
});
```

### `AuthForm.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schemas';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { type infer as zodInfer } from 'zod';

type LoginFormValues = zodInfer<typeof loginSchema>;

const AuthForm = ({ onSubmit }: { onSubmit: (values: LoginFormValues) => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      <Button type="submit" loading={isSubmitting}>Sign in</Button>
    </form>
  );
};

export default AuthForm;
```

---

## 19. Production-ready Engineering Decisions

### Clean architecture

- Co-locate domain data, hooks, and components inside feature folders.
- Keep UI primitives decoupled from business logic.
- Use typed models and interfaces for data contracts.

### SOLID principles

- Single Responsibility: each slice, component, and hook has a narrow purpose.
- Open/Closed: features extend via new components or endpoints rather than mutation.
- Liskov Substitution: UI components accept generic props and behave predictably.
- Interface Segregation: separate auth, cart, and product concerns.
- Dependency Inversion: use providers, hooks, and service abstractions.

### Scalability patterns

- Feature-based folders simplify team ownership.
- Shared design system components reduce duplicated UI logic.
- API modules and slices are extensible and isolated.
- Layouts and page scaffolds are reusable across route groups.

### Type safety

- Use TypeScript for all components, state, API payloads, and forms.
- Use `zod` schemas to keep backend and frontend validation aligned.
- Avoid `any` in favor of typed domain models.

---

## 20. Implementation Roadmap

1. Create `frontend/src/app` route structure and layouts.
2. Build shared UI component library in `components/ui`.
3. Implement `services/api/baseApi.ts` and RTK Query modules.
4. Implement `authSlice`, `cartSlice`, `productSlice`, `orderSlice`, and `adminSlice`.
5. Implement login/signup forms with React Hook Form and Zod.
6. Add `AuthGuard` and role-based route protection.
7. Implement product listing, detail, cart, checkout, orders, and profile pages.
8. Add admin dashboard pages and management features.
9. Optimize performance using dynamic imports, server components, and image optimization.
10. Add error boundaries, skeleton loaders, and toast feedback.
11. Add Docker support and environment config.
12. Prepare AWS-ready deployment with CloudFront and secure environment variables.

---

## 21. Recommended Next Step

Place this architecture file in the `frontend` folder and use it as the blueprint for the actual implementation. The next phase is to scaffold the first feature modules and base API integration in code.
