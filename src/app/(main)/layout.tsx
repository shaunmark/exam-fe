import { AppHeader } from '@/components/AppHeader';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <AppHeader /> */}
      {children}
    </>
  );
}
