import './globals.css';
import { ReactNode } from 'react';
import ReduxProvider from '@/providers/ReduxProvider';

export const metadata = {
  title: 'CloudCart',
  description: 'Enterprise cloud-native e-commerce platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
