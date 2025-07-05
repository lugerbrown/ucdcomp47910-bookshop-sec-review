import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import axios from "axios";
import "./App.css";

// Create a separate NavBar component that can use useNavigate
function NavBar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to check authentication status using the same approach as your cart
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8080/user", { withCredentials: true });
            setIsLoggedIn(true);
            try {
                const userResponse = await axios.get("http://localhost:8080/session-user", { withCredentials: true });
                setUser(userResponse.data);
            } catch {
                setUser({ name: "Logged in", surname: "user", role: "CUSTOMER" });
            }
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        // Listen for custom auth events
        const handleAuthChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/logout", {}, { withCredentials: true });
            setUser(null);
            setIsLoggedIn(false);
            alert("Logged out successfully");
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
            setUser(null);
            setIsLoggedIn(false);
            navigate("/login");
        }
    };

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <div className="flex gap-4">
                <Link to="/" className="hover:text-gray-300">Home</Link>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
                {isLoggedIn && (user?.role === 'CUSTOMER' || user?.role === 'ADMIN') && (
                    <Link to="/cart" className="hover:text-gray-300">Cart</Link>
                )}
                {isLoggedIn && user?.role === 'ADMIN' && (
                    <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <span className="text-green-400">
                            Logged in: {user?.name && user?.surname ? `${user.name} ${user.surname}`:''}
                            {user?.role === 'ADMIN' && (
                                <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    ADMIN
                                </span>
                            )}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <span className="text-gray-400">Not logged in</span>
                )}
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Router>
    );
}

export default App;