import React, { useState } from "react";
import axios from "axios";

function Register() {
    const [user, setUser] = useState({});

    const register = () => {
        console.log("Registering user:", user);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(user.dateOfBirth)) {
            alert("Date of Birth must be in YYYY-MM-DD format");
            return;
        }
        axios.post("http://localhost:8080/register", user)
            .then((res) => {
                alert(res.data);
                setUser({});
                document.querySelectorAll('input[placeholder]').forEach(input => {
                    input.value = '';
                });
            })
            .catch((err) => {
                console.error("Registration error:", err.response?.data || err.message);
                alert("Registration failed");
            });
    };

    return (
        <div className="flex justify-center items-start pt-28">
            <div className="p-8 border rounded-lg shadow-lg bg-white max-w-md w-full">
                <h2 className="text-lg font-bold text-center mb-6">Register</h2>
                <input placeholder="Username" onChange={(e) => setUser({ ...user, username: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input type="password" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Name" onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Surname" onChange={(e) => setUser({ ...user, surname: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Date of Birth (YYYY-MM-DD)" onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Address" onChange={(e) => setUser({ ...user, address: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Phone" onChange={(e) => setUser({ ...user, phone: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <button onClick={register} className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors mt-4">Register</button>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account? <a href="login" className="text-blue-500 hover:text-blue-700 underline">Login</a>
                </p>
            </div>
        </div>
    );
}
export default Register;