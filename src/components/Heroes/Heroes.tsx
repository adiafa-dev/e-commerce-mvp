import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Heroes() {
  return (
    <>
      <section id="heroesSection" className="relative flex flex-col p-4 md:py-10 md:px-0">
        <div className="w-[1200px] mx-auto">
          <div id="containerNewCollection" className="flex items-center justify-between w-full bg-[#F3D7A4] rounded-[16px] shadow-md gap-4">
            {/* <!-- === HERO IMAGE  === --> */}
            <div className="flex-shrink-0 w-1/2 md:w-1/3 flex justify-center md:mb-0">
              <Image src="/assets/images/heroes-img.png" alt="New Collection Man & Woman" className="h-64 md:h-72 object-cover rounded-lg" width={288} height={288} />
            </div>

            {/* <!-- === CONTAINER NEW COLLECTION TEXT === --> */}
            <div className="w-1/2 md:w-2/3">
              <h1 className="text-base md:text-[56px] font-bold text-[#553E32]">NEW COLLECTION</h1>
              <p className="text-[10px] md:text-2xl font-semibold text-[#553E32] mb-6">Stylish men’s apparel for every occasion</p>
              <div className="flex justify-start text-center items-center">
                <Button className="bg-neutral-950 text-[10px] md:text-base text-white rounded-lg md:w-auto hover:bg-primary  hover:text-black transition duration-500 md:py-3 md:px-14 h-12 px-8 cursor-pointer">
                  <Link href="/product">Get Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
