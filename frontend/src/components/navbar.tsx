'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/logo.svg';
import { usePathname } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';

export default function Navbar() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) =>
    `text-lg ${pathname === path ? 'text-pink-500' : 'text-white'} hover:text-gray-300`;

  return (
    <nav className="bg-black bg-opacity-60 shadow-lg fixed w-full top-0 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image src={Logo} alt="OpenShop Logo" width={150} height={50} />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/marketplace" className={navLinkClasses('/marketplace')}>
              Marketplace
            </Link>
            <Link href="/profile" className={navLinkClasses('/profile')}>
              Profile
            </Link>
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
