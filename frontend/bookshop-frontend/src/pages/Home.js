import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [books, setBooks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/books").then((res) => setBooks(res.data));
        axios.get("http://localhost:8080/cart/view", { withCredentials: true })
            .then(() => setIsLoggedIn(true))
            .catch(() => setIsLoggedIn(false));
    }, []);

    const addToCart = async (bookId) => {
        setLoading(prev => ({ ...prev, [bookId]: true }));

        try {
            await axios.post(
                `http://localhost:8080/cart/add/${bookId}`,
                {},
                { withCredentials: true }
            );
            setMessage("Book added to cart successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessage("Please log in to add items to cart");
                setIsLoggedIn(false);
            } else if (error.response?.status === 400) {
                setMessage(error.response.data || "Not enough copies available");
            } else {
                setMessage("Failed to add book to cart");
            }
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(prev => ({ ...prev, [bookId]: false }));
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-lg font-bold">BookShop</h2>
            {message && (
                <div className={`p-4 mb-6 rounded-lg ${
                    message.includes('successfully')
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                    {message}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                        <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mb-3 mx-auto">
                            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-blue-500 rounded-sm"></div>
                            </div>
                        </div>
                        <div className="text-center mb-4">
                            <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                            <p className="text-lg font-bold text-gray-800">€{book.price}</p>
                            {book.copies === 0 && (
                                <p className="text-red-500 text-sm mt-1">(Out of Stock)</p>
                            )}
                        </div>
                        <button
                            onClick={() => addToCart(book.id)}
                            disabled={book.copies === 0 || loading[book.id]}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                book.copies === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                            } ${loading[book.id] ? 'opacity-50' : ''}`}
                        >
                            {loading[book.id] ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>
            {books.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Loading books...</p>
                </div>
            )}
        </div>
    );
}

export default Home;