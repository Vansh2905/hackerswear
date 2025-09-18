import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png"; // Save your logo as /public/logo.png

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-8 ">
      <div className="container mx-auto px-6 md:flex md:justify-between md:items-center">
        {/* Logo & Brand */}
        <Link href={"/"}>
        <div className="flex items-center space-x-3">
          <Image src={Logo} alt="Hackerswear Logo" width={50} height={50} />
          <span className="text-xl font-bold text-white">Hackerswear.com</span>
        </div>
        </Link>

        {/* Navigation Links */}
        <div className="mt-6 md:mt-0 flex space-x-6">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/product/shop" className="hover:text-white transition">Shop</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Hackerswear.com — All rights reserved.
      </div>
    </footer>
  );
}
