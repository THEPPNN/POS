import { useState } from "react";
import api from "../../../lib/axios";
import ServerDataTable from "../../../components/table/ServerDataTable";
import ModalReport from "../../../pages/admin/Outlet/ModalReport";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reload, setReload] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [report, setReport] = useState<any>(null);

  const columns = [
    { name: "ลำดับ", selector: (r: any, index: number) => (page - 1) * perPage + index + 1, width: "5%" },
    { name: "วันที่", selector: (r: any) => new Date(r.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }), width: "10%" },
    { name: "เลขบิล", selector: (r: any) => r.id, width: "10%" },
    { name: "ยอดรวม", selector: (r: any) => r.total.toFixed(2), width: "10%" },
    { name: "วิธีชำระ", selector: (r: any) => r.method, width: "20%" },
    { name: "รับเงิน", selector: (r: any) => r.received?.toFixed(2), width: "5%" },
    { name: "เงินทอน", selector: (r: any) => r.change?.toFixed(2), width: "5%" },
    { name: "พนักงาน", selector: (r: any) => r.employeeName, width: "20%" },
    {
      name: "จัดการ", width: "20%", cell: (row: any) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleViewReport(row.id)}>ดู</button>
      )
    },
  ];

  const handleViewReport = async (id: number) => {
    const res = await api.get(`/reports/${id}`);
    if (res.status === 200) {
      setReport(res.data.sale);
      setOpenModal(true);
    } else {

    }
  };

  const fetchReports = async ({ page, perPage, search }: any) => {
    const res = await api.get("/reports", {
      params: {
        offset: (page - 1) * perPage,
        limit: perPage,
        search,
        from,
        to,
      },
    });
    return {
      data: res.data.data,
      total: res.data.total
    };
  };

 
  const exportExcel = async () => {
    const res = await api.get("/reports/export-excel", {
      params: {
        from,
        to,
      },
      responseType: "blob", // ⭐ สำคัญมาก
    });
  
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="bg-white p-6 shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* วันที่เริ่มต้น */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              วันที่
            </label>
            <input
              type="date"
              className="border rounded-lg p-2 w-full"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>

          {/* ถึงวันที่ */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ถึงวันที่
            </label>
            <input
              type="date"
              className="border rounded-lg p-2 w-full"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>

          {/* ค้นหา */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ค้นหา (เลขบิล)
            </label>
            <input
              type="text"
              placeholder="เช่น 10234"
              className="border rounded-lg p-2 w-full"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          {/* ปุ่มค้นหา */}
          <div className="flex gap-2">
            <button
              onClick={() => setReload(prev => prev + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 w-full transition"
            >
              ค้นหา
            </button>
            <button
              onClick={() => {
                setFrom("");
                setTo("");
                setSearchInput("");
                setReload(prev => prev + 1);
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-6 py-2 w-full transition"
            >
              Reset
            </button>
            <button
              onClick={exportExcel}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-2 w-full transition"
            >
              Excel
            </button>
          </div>

        </div>
      </div>

      <ServerDataTable
        searchInput={searchInput}
        columns={columns}
        fetchData={fetchReports}
        reload={reload}
        title="รายงานการขาย"
      />

      <ModalReport
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        report={report}
      />

    </div>
  );
}