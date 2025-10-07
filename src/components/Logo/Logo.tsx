import Image from 'next/image';

type LogoProps = {
  sizeWidth: number;
};

export default function Logo({ sizeWidth }: LogoProps) {
  return (
    <>
      <Image src="/assets/images/logo.svg" alt="Logo" width={sizeWidth} height={sizeWidth} />
      <span className="text-neutral-950 text-2xl font-bold">Shirt</span>
    </>
  );
}
