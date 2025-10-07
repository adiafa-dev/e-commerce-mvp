import Link from 'next/link';
import Image from 'next/image';

type SocMedItem = {
  label: string;
  href: string;
  srcSocMed: string;
  widthIcon: number;
  heightIcon: number;
};

export default function SocialMediaList() {
  const socMedItems: SocMedItem[] = [
    { label: 'Facebook', href: '#', srcSocMed: '/assets/images/icons/fb.svg', widthIcon: 12, heightIcon: 21 },
    { label: 'Instagram', href: '#', srcSocMed: '/assets/images/icons/instagram.svg', widthIcon: 21, heightIcon: 21 },
    { label: 'Linkedin', href: '#', srcSocMed: '/assets/images/icons/linked-in.svg', widthIcon: 18, heightIcon: 17 },
    { label: 'TikTok', href: '#', srcSocMed: '/assets/images/icons/tiktok.svg', widthIcon: 18, heightIcon: 20 },
  ];

  return (
    <>
      {socMedItems.map(({ label, href, srcSocMed, widthIcon, heightIcon }) => (
        <Link key={label} href={href} className="border border-neutral-300 aspect-square rounded-full w-10 flex justify-center items-center hover:bg-primary transition duration-500">
          <Image src={srcSocMed} alt={label} width={widthIcon} height={heightIcon} />
        </Link>
      ))}
    </>
  );
}
