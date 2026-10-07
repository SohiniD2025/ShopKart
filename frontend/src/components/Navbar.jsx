import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchWishlist, logoutCustomer } from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Live cart count from global CartContext (Task 6 & Task 9 requirement)
  const { cartCount } = useCart();
  
  const [wishlistCount, setWishlistCount] = useState(null);

  // Hide Navbar on authentication pages
  const authenticationPaths = ["/", "/login", "/register"];
  const isAuthenticationPath = authenticationPaths.includes(location.pathname);

  useEffect(() => {
    if (isAuthenticationPath) {
      return;
    }

    const loadWishlistCount = async () => {
      try {
        const response = await fetchWishlist();
        setWishlistCount(response.data.count);
      } catch {
        setWishlistCount(null);
      }
    };

    loadWishlistCount();
    window.addEventListener("wishlist:changed", loadWishlistCount);

    return () => {
      window.removeEventListener("wishlist:changed", loadWishlistCount);
    };
  }, [isAuthenticationPath, location.pathname]);

  if (isAuthenticationPath) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      setWishlistCount(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold">
          ShopKart
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/home" className="font-medium hover:text-blue-600">
            Home
          </Link>

          <Link to="/products" className="font-medium hover:text-blue-600">
            Products
          </Link>

          <Link to="/wishlist" className="font-medium hover:text-blue-600">
            Wishlist{wishlistCount !== null ? ` (${wishlistCount})` : ""}
          </Link>

          {/* 2. Cart link with dynamic badge count that updates instantly */}
          <Link to="/cart" className="font-medium hover:text-blue-600 flex items-center gap-1.5">
            Cart <span className="bg-stone-900 text-white text-xs px-2 py-0.5 rounded-full font-bold">{cartCount}</span>
          </Link>

          <Link to="/profile" className="font-medium hover:text-blue-600">
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;