import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });
            console.log(res);
            //   if(res.data.status === 200) {
            //     localStorage.setItem("token", res.data.token);
            //     localStorage.setItem("user", JSON.stringify(res.data.user));
            //     navigate("/pos");
            //   } else {
            //     setError(res.data.message);
            //   }
        } catch (err: any) {
            navigate("/pos");
            setError(
                err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">เข้าสู่ระบบ POS</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
                </button>
            </form>
        </div>
    );
}