import { useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";

const API = "http://localhost:5000/api";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            onLogin();
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="mb-4 text-center py-2 px-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={login} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            className="input-field"
                            placeholder="admin@example.com"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            className="input-field"
                            placeholder="••••••••"
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full btn-primary py-2.5 shadow-lg shadow-blue-500/20">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
