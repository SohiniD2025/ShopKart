import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

// Global Cart Context Provider (Task 6 requirement)
import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <BrowserRouter>
            {/* Wrap the application in CartProvider so Navbar, Products, and Cart share the same state */}
            <CartProvider>
                <Navbar />

                <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/cart" element={<Cart />} />
                    </Route>
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;