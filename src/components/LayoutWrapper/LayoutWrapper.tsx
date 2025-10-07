'use client';

import { usePathname } from 'next/navigation';
import Footer from '../Footer';
import Header from '../Header';

const disableSection = ['/login', '/register'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHidden = disableSection.includes(pathname);

  return (
    <>
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && <Footer />}
    </>
  );
}
