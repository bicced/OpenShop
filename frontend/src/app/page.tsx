import Image from "next/image";
import Logo from "../../public/logo.svg";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r">
      <div className="text-center p-8 bg-white bg-opacity-30 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <Image src={Logo} alt="OpenShop Logo" width={300} height={150} className="rounded-full" />
        </div>
        <p className="text-lg mb-6">
          Decentralized marketplace for buying and selling physical products
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/marketplace" className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105">
            Buy Products
          </Link>
          <Link href="/profile" className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-transform transform hover:scale-105">
            Sell Products
          </Link>
        </div>
      </div>
    </div>
  );
}