type Props = {
  barcodeRef: React.RefObject<HTMLInputElement>;
  barcode: string;
  setBarcode: (val: string) => void;
  handleScan: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BarcodeInput({
  barcodeRef,
  barcode,
  setBarcode,
  handleScan,
}: Props) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">
        ยิงบาร์โค้ด
      </label>
      <input
        ref={barcodeRef}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleScan(e);
          }
        }}
        placeholder="สแกนบาร์โค้ด..."
        className="mt-1 text-lg border rounded w-full px-4 py-3 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}