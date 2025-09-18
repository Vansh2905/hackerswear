import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center"
        style={{ backgroundImage: "url('/Background.jpeg')" }}
      >
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Our Store
          </h1>
          <p className="text-lg text-gray-200 mb-6 drop-shadow">
            Discover the latest T-shirts, hoodies, mugs, and stickers. <br />
            Quality products, designed just for you.
          </p>
          <a
            href="#products"
            className="inline-block bg-white text-black font-medium px-8 py-3 rounded-full shadow-lg hover:bg-gray-200 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-10">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Tshirt", img: "/tshirt.jpg", href:"/Tshirts"},
            { name: "Hoodie", img: "/hoodie.jpeg", href:"/Hoodies",},
            { name: "Mug", img: "/mug.jpeg", href:"/Mugs"},
            { name: "Sticker Pack", img: "/sticker.jpeg", href:"/Stickers"},
          ].map((product, idx) => (
            <div
              key={idx}
              className="border rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative w-full h-56">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                  <Link href={product.href}>Check it Out</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
