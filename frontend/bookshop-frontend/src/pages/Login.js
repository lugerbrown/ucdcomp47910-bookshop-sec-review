import React, { useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);

        try {
            const res = await axios.post("http://localhost:8080/login", params, {
                withCredentials: true,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });
            alert(res.data);
            window.dispatchEvent(new Event('authChange'));
            const userRes = await axios.get("http://localhost:8080/user", { withCredentials: true });
            const role = userRes.data.role;
            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };
    return (
        <div className="flex justify-center items-start pt-28">
            <div className="p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-lg font-bold text-center mb-6">Login</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border p-3 my-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={login}
                    className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-colors mt-4"
                >
                    Login
                </button>
                <p className="text-center mt-4 text-sm text-gray-600">
                    No account? <a href="register" className="text-blue-500 hover:text-blue-700 underline">Register here</a>
                </p>
            </div>
        </div>
    );
}
export default Login;