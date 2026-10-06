import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchWishlist, logoutCustomer } from "../services/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(null);

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
    <nav className="w-full bg-white shadow-sm px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold">
          ShopKart
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/home" className="font-medium hover:text-blue-600">
            Home
          </Link>

          <Link to="/products" className="font-medium hover:text-blue-600">
            Products
          </Link>

          <Link to="/wishlist" className="font-medium hover:text-blue-600">
            Wishlist{wishlistCount !== null ? ` (${wishlistCount})` : ""}
          </Link>

          <Link to="/profile" className="font-medium hover:text-blue-600">
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
