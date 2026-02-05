import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // logout button
    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    // const handleLogout = async () => {
    //     try {
    //         await api.post("/auth/logout");
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("user");
    //         navigate("/login");
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`
          fixed md:static z-30 top-0 left-0 h-full w-64 bg-gray-900 text-white p-4
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                <h1 className="text-xl font-bold mb-6">🛒 POS Admin</h1>

                <nav className="space-y-2 h-full relative">
                    <NavLink to="/dashboard" end className={navClass}>
                        🏠 หน้าแรก
                    </NavLink>

                    <NavLink to="/products" className={navClass}>
                        📦 จัดการสินค้า
                    </NavLink>

                    <NavLink to="/reports" className={navClass}>
                        📊 รายงาน
                    </NavLink>

                    <NavLink to="/pos" target="_blank" className={navClass}>
                        💵 ขายสินค้า
                    </NavLink>

                    <NavLink to="#" className="mt-4 block p-2 rounded hover:bg-gray-700" onClick={handleLogout}>
                        🚪 ออกจากระบบ
                    </NavLink>
                </nav>
            </aside>

            {/* Overlay (mobile only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex flex-col flex-1">
                {/* Topbar */}
                <header className="h-14 bg-white shadow flex items-center px-4 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-gray-200"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="ml-3 font-semibold">OS Admin</span>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

/* helper */
const navClass = ({ isActive }: { isActive: boolean }) =>
    `block p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""}`;