import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* 1. Features Banner */}
      <section className="bg-gray py-4 my-1">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xs text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Free Shipping</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure Checkout</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </section>


      {/* 2. Hero Section */}
      <section className="bg-[#EFEFEF] py-12 px-8 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto w-full rounded-b-sm">
        <div className="md:w-1/2 space-y-4 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
            Discover Your Style
          </h1>
          <p className="text-xs text-gray-500">
            Shop the latest trends & exclusive offers
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-[#FF6633] hover:bg-[#e55524] text-white text-xs font-semibold px-6 py-2.5 rounded shadow-sm transition-colors"
          >
            Shop Now
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
            alt="Hero Style"
            className="h-64 object-cover rounded-lg"
          />
        </div>
      </section>


      
      {/* 4. Featured Collections Section */}
      <section className="max-w-4xl mx-auto px-4 py-8 w-full">
        <h2 className="text-xl font-serif text-center text-gray-800 mb-8">
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-52 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400"
                alt="Spring Fashion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-3">Spring Fashion</span>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-52 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"
                alt="Luxury Watches"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-3">Luxury Watches</span>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-52 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400"
                alt="Home Essentials"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-3">Home Essentials</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;