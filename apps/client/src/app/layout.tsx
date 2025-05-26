import './global.css';
import PageProvider from '../components/helpers/PageProvider';
import StoreProvider from './StoreProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <PageProvider>{children}</PageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
