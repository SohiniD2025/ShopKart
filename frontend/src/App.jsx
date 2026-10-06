import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Profile from "./pages/Profile";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>


                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}


export default App;
