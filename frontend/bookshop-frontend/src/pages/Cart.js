import React, { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
    const [items, setItems] = useState([]);
    const [creditCard, setCreditCard] = useState("");
    const [message, setMessage] = useState("");

    const loadCart = () => {
        axios.get("http://localhost:8080/cart/view", { withCredentials: true })
            .then((res) => setItems(res.data));
    };

    const removeItem = (id) => {
        axios.delete(`http://localhost:8080/cart/remove/${id}`).then(() => loadCart());
    };

    const checkout = () => {
        if (!items || items.length === 0) {
            setMessage("Your cart is empty. Please add items before checkout.");
            return;
        }
        if (!creditCard.trim()) {
            setMessage("Please enter a credit card number");
            return;
        }
        if (!/^\d+$/.test(creditCard.trim())) {
            setMessage("Please enter a valid credit card number (numbers only)");
            return;
        }
        axios.post("http://localhost:8080/cart/checkout", {}, { withCredentials: true })
            .then((res) => {
                setItems([]);
                setCreditCard("");
                setMessage("Order placed!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch((err) => {
                setMessage("Checkout failed. Please try again.");
            });
    };

    useEffect(() => {
        loadCart();
    }, []);

    const consolidatedItems = items.reduce((acc, item) => {
        const bookId = item.book.id;
        if (acc[bookId]) {
            acc[bookId].quantity += item.quantity;
        } else {
            acc[bookId] = { ...item };
        }
        return acc;
    }, {});

    const consolidatedItemsArray = Object.values(consolidatedItems);
    const total = consolidatedItemsArray.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Your Cart</h2>
            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes("Order placed") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}
            <ul>
                {consolidatedItemsArray.map((item) => (
                    <li key={item.book.id} className="border-b py-2">
                        {item.book.title} - €{item.book.price} x {item.quantity}
                        <button onClick={() => removeItem(item.id)} className="ml-4 text-red-600">Remove</button>
                    </li>
                ))}
            </ul>
            <div className="mt-4 font-bold">Total: €{total.toFixed(2)}</div>

            <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Credit Card Number:</label>
                <input
                    type="text"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                    placeholder="Enter credit card number"
                    className="block border border-gray-300 p-2 rounded w-full max-w-md"
                />
            </div>

            <button onClick={checkout} className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                Checkout
            </button>
        </div>
    );
}
export default Cart;