import Link from 'next/link';
import Logo from '../Logo';
import Image from 'next/image';
import SearchInput from '../SearchInput';
import HeaderRight from './HeaderRight';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <>
      {/* <!-- === start HEADER === --> */}
      <header className="drop-shadow-sm drop-shadow-neutral-300 bg-white p-4 md:p-0">
        <div className="w-full md:w-[1200px] mx-auto flex gap-4 md:py-5 md:gap-20 items-center">
          {/* <!-- === TOP LOGO === --> */}
          <div className="md:w-1/6">
            <Link href="/" className="flex items-center gap-1 md:gap-2.5">
              <Logo sizeWidth={42} />
            </Link>
          </div>

          {/* <!-- === TOP CATALOG BUTTON & SEARCH === --> */}
          <div className="flex w-full md:w-1/2 gap-1 md:gap-2.5">
            <Button asChild variant="outline" className="flex items-center px-2 md:px-4 gap-2.5 text-sm border-neutral-300 border rounded-md hover:bg-primary transition duration-500 h-12">
              <Link href="/product" className="flex items-center">
                <Image src="/assets/images/icons/catalog.svg" alt="Catalog Icon" width={20} height={20} />
                <span className="hidden md:block text-sm">Catalog</span>
              </Link>
            </Button>

            <SearchInput />
          </div>

          <HeaderRight />
        </div>
      </header>
    </>
  );
}
