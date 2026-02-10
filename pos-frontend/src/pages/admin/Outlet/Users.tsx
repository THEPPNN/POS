import { useEffect, useState } from "react";
import ServerDataTable from "../../../components/table/ServerDataTable";
import api from "../../../lib/axios";
import Swal from "sweetalert2";

export default function Users() {
    const [reload, setReload] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "CASHIER",
        status: "ACTIVE",
    });

    // ================== TABLE ==================
    const columns = [
        { name: "ชื่อผู้ใช้งาน", selector: (r: any) => r.name },
        { name: "อีเมล", selector: (r: any) => r.email },
        { name: "สิทธิ์", selector: (r: any) => r.role },
        { name: "สถานะ", selector: (r: any) => r.status },
        {
            name: "จัดการ",
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(row)}
                    >
                        แก้ไข
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(row.id)}
                    >
                        ลบ
                    </button>
                </div>
            ),
        },
    ];

    const fetchUsers = async ({ page, perPage, search }: any) => {
        const res = await api.get("/users", {
            params: {
                offset: (page - 1) * perPage,
                limit: perPage,
                search,
            },
        });
        return {
            data: res.data.users,
            total: res.data.total,
        };
    };

    // ================== CREATE ==================
    const handleCreate = () => {
        setEditingId(null);
        setForm({
            name: "",
            email: "",
            password: "",
            role: "CASHIER",
            status: "ACTIVE",
        });
        setOpenModal(true);
    };

    // ================== EDIT ==================
    const handleEdit = (user: any) => {
        setEditingId(user.id);
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            status: user.status,
        });
        setOpenModal(true);
    };

    // ================== SAVE ==================
    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    status: form.status,
                });
            } else {
                await api.post("/users", form);
            }

            Swal.fire("สำเร็จ", "บันทึกข้อมูลเรียบร้อย", "success");
            setOpenModal(false);
            setReload((r) => r + 1);
        } catch (err: any) {
            Swal.fire("ผิดพลาด", err.response?.data?.message || "เกิดข้อผิดพลาด", "error");
        }
    };

    // ================== DELETE ==================
    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: "ยืนยันการลบ?",
            text: "ไม่สามารถกู้คืนข้อมูลได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        });

        if (!confirm.isConfirmed) return;

        await api.delete(`/users/${id}`);
        Swal.fire("ลบแล้ว", "", "success");
        setReload((r) => r + 1);
    };

    return (
        <div>
            <div className="flex justify-between bg-white p-4 shadow-md">
                <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    เพิ่มผู้ใช้งาน
                </button>
            </div>

            <div className="bg-white p-4 shadow-md mt-4">
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ค้นหาชื่อ / อีเมล"
                    className="border rounded w-full px-3 py-2 mb-4"
                />

                <ServerDataTable
                    columns={columns}
                    fetchData={fetchUsers}
                    reload={reload}
                    searchInput={searchInput}
                    title="รายการผู้ใช้งาน"
                />
            </div>

            {/* ================= MODAL ================= */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
                        </h2>

                        <input
                            className="border w-full p-2 mb-2"
                            placeholder="ชื่อผู้ใช้งาน"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <input
                            className="border w-full p-2 mb-2"
                            placeholder="อีเมล"
                            disabled={!!editingId}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />

                        <input
                            type="password"
                            className="border w-full p-2 mb-2"
                            placeholder={editingId ? "หากต้องการเปลี่ยนรหัสผ่านให้ระบุ" : "รหัสผ่าน"}
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />

                        <select
                            className="border w-full p-2 mb-2"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="CASHIER">CASHIER</option>
                        </select>

                        <select
                            className="border w-full p-2 mb-4"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            {editingId && (
                                <option value="INACTIVE">INACTIVE</option>
                            )}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}