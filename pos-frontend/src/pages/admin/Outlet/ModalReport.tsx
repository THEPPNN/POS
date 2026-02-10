type Props = {
    isOpen: boolean;
    onClose: () => void;
    report: any;
  };
  
  export default function ModalReport({ isOpen, onClose, report }: Props) {
    if (!isOpen || !report) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md shadow-lg relative">
  
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">รายละเอียดบิล</h2>
              <p className="text-sm text-gray-500">
                เลขบิล #{report.id}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(report.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
  
          {/* Body */}
          <div className="px-6 py-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {report.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-2 last:border-b-0"
                >
                  <div className="pr-2">
                    <p className="font-medium leading-snug">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.qty} × {item.sellPrice.toFixed(2)} บาท
                    </p>
                  </div>
  
                  <p className="font-semibold whitespace-nowrap">
                    {(item.qty * item.sellPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 space-y-1 text-sm">
            <div className="flex justify-between font-semibold">
              <span>ยอดรวม</span>
              <span>{report.total.toFixed(2)} บาท</span>
            </div>
  
            <div className="flex justify-between text-gray-600">
              <span>รับเงิน</span>
              <span>{report.received?.toFixed(2)} บาท</span>
            </div>
  
            <div className="flex justify-between text-gray-600">
              <span>เงินทอน</span>
              <span>{report.change?.toFixed(2)} บาท</span>
            </div>
  
            <div className="flex justify-between text-gray-600">
              <span>วิธีชำระ</span>
              <span>
                {report.method === "CASH" ? "เงินสด" : report.method}
              </span>
            </div>
          </div>
  
        </div>
      </div>
    );
  }