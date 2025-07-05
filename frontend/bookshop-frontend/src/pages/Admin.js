import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [book, setBook] = useState({});
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/user", { withCredentials: true })
            .then(res => {
                if (res.data.role !== "ADMIN") {
                    navigate("/login");
                }
            })
            .catch(() => navigate("/login"));
        loadBooks();
    }, []);

    const loadBooks = () => {
        axios.get("http://localhost:8080/books")
            .then(res => setBooks(res.data))
            .catch(err => console.error("Failed to load books:", err));
    };

    const addBook = () => {
        axios.post("http://localhost:8080/admin/book", book, {
            withCredentials: true
        })
            .then((res) => {
                alert(res.data);
                setBook({});
                document.querySelectorAll('input[placeholder]').forEach(input => {
                    if (!input.closest('.edit-section')) {
                        input.value = '';
                    }
                });
                loadBooks();
            })
            .catch(() => alert("Only admins can add books"));
    };

    const updateBook = (bookId) => {
        axios.put(`http://localhost:8080/admin/book/${bookId}`, editingBook, {
            withCredentials: true
        })
            .then((res) => {
                alert("Book updated successfully");
                setEditingBook(null);
                loadBooks();
            })
            .catch(() => alert("Failed to update book"));
    };

    const deleteBook = (bookId) => {
        console.log("Attempting to delete book with ID:", bookId);
        if (window.confirm("Are you sure you want to delete this book? This will also remove it from all user carts.")) {
            axios.delete(`http://localhost:8080/admin/book/${bookId}/from-carts`, {
                withCredentials: true
            })
                .then(() => {
                    return axios.delete(`http://localhost:8080/admin/book/${bookId}`, {
                        withCredentials: true
                    });
                })
                .then((res) => {
                    console.log("Delete response:", res.data);
                    alert("Book deleted successfully");
                    loadBooks();
                })
                .catch((err) => {
                    console.error("Delete error:", err.response?.data);

                    if (err.response?.data?.includes("foreign key constraint")) {
                        alert("Cannot delete this book because it's currently in someone's cart. Please ask users to remove it from their carts first, or contact your database administrator.");
                    } else {
                        const errorMsg = err.response?.data?.message ||
                            err.response?.data ||
                            `HTTP ${err.response?.status}: ${err.message}` ||
                            err.message ||
                            "Unknown error";
                        alert("Failed to delete book: " + errorMsg);
                    }
                });
        }
    };
    const startEdit = (book) => {
        setEditingBook({ ...book });
    };

    const cancelEdit = () => {
        setEditingBook(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
            <div className="mb-8 p-4 border rounded">
                <h3 className="text-md font-semibold mb-2">Add New Book</h3>
                <input
                    placeholder="Title"
                    onChange={(e) => setBook({...book, title: e.target.value})}
                    className="block border p-2 my-2 w-full max-w-md"
                />
                <input
                    placeholder="Author"
                    onChange={(e) => setBook({...book, author: e.target.value})}
                    className="block border p-2 my-2 w-full max-w-md"
                />
                <input
                    type="number"
                    placeholder="Year"
                    onChange={(e) => setBook({...book, year: parseInt(e.target.value)})}
                    className="block border p-2 my-2 w-full max-w-md"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    onChange={(e) => setBook({...book, price: parseFloat(e.target.value)})}
                    className="block border p-2 my-2 w-full max-w-md"
                />
                <input
                    type="number"
                    placeholder="Copies"
                    onChange={(e) => setBook({...book, copies: parseInt(e.target.value)})}
                    className="block border p-2 my-2 w-full max-w-md"
                />
                <button onClick={addBook} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    Add Book
                </button>
            </div>
            <div>
                <h3 className="text-md font-semibold mb-4">Manage Books</h3>
                <div className="space-y-4">
                    {books.map((bookItem) => (
                        <div key={bookItem.id} className="border p-4 rounded">
                            {editingBook && editingBook.id === bookItem.id ? (
                                /* Edit Mode */
                                <div className="edit-section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            value={editingBook.title || ''}
                                            onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                                            placeholder="Title"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            value={editingBook.author || ''}
                                            onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                                            placeholder="Author"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            type="number"
                                            value={editingBook.year || ''}
                                            onChange={(e) => setEditingBook({...editingBook, year: parseInt(e.target.value)})}
                                            placeholder="Year"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingBook.price || ''}
                                            onChange={(e) => setEditingBook({...editingBook, price: parseFloat(e.target.value)})}
                                            placeholder="Price"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            type="number"
                                            value={editingBook.copies || ''}
                                            onChange={(e) => setEditingBook({...editingBook, copies: parseInt(e.target.value)})}
                                            placeholder="Copies"
                                            className="border p-2 rounded"
                                        />
                                    </div>
                                    <div className="mt-4 space-x-2">
                                        <button
                                            onClick={() => updateBook(bookItem.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div><strong>Title:</strong> {bookItem.title}</div>
                                        <div><strong>Author:</strong> {bookItem.author}</div>
                                        <div><strong>Year:</strong> {bookItem.year}</div>
                                        <div><strong>Price:</strong> €{bookItem.price}</div>
                                        <div><strong>Copies:</strong> {bookItem.copies}</div>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => startEdit(bookItem)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteBook(bookItem.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Admin;