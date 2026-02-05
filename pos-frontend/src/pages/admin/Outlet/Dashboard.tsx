export default function Dashboard() {
    function ReportCard({ title, value }: any) {
        return (
          <div className="bg-white shadow rounded p-4">
            <p className="text-gray-500">{title}</p>
            <h2 className="text-xl font-bold mt-2">{value}</h2>
          </div>
        );
      }

    return (
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <ReportCard title="ยอดขายวันนี้" value="3,250 ฿" />
          <ReportCard title="สินค้าขายดี" value="โค้ก (120 ชิ้น)" />
          <ReportCard title="ยอดขายตามพนักงาน" value="สมชาย 1,500 ฿" />
        </div>
      </div>
    );
  }