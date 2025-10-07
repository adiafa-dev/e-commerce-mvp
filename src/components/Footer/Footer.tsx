import Link from 'next/link';
import Logo from '../Logo';
import SocialMedia from '../SocialMedia';

export default function Footer() {
  return (
    <>
      <footer className="border-t border-neutral-300 py-10">
        <div id="footerWrapper" className="max-w-[1200px] w-full mx-auto flex flex-col gap-5 md:flex-row md:gap-10 px-4">
          {/* <!-- === LEFT SECTION SHIRT === --> */}
          <div className="w-full md:w-1/2">
            <Link href="/" className="flex items-center gap-1 md:gap-2.5">
              <Logo sizeWidth={42} />
            </Link>

            <p className="text-sm py-4 md:text-base md:pb-10 md:w-3/4">
              Explore a realm of style with our fashion e-commerce platform, where shopping is effortless. Experience a smooth journey with an extensive selection of trendy apparel, all delivered directly to your home
            </p>

            {/* <!-- === SOCIAL MEDIA === --> */}
            <SocialMedia />
          </div>

          {/* <!-- === E-COMMERCE === --> */}
          <div className="w-full md:w-1/4 pt-2.5 text-sm md:text-base">
            <h4 className="font-bold pb-5">E-commerce</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- === HELP === --> */}
          <div className="w-full md:w-1/4 pt-2.5 text-sm md:text-base">
            <h4 className="font-bold pb-5">Help</h4>
            <ul className="flex flex-col gap-5">
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  How to Transact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  Payment Method
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-500">
                  How to Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
