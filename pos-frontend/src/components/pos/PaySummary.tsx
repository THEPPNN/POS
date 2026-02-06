type Props = {
    total: number;
  };
  
  export default function PaySummary({ total }: Props) {
    return (
      <div className="mt-4">
        <p className="text-lg">
          รวมทั้งหมด:
          <span className="text-3xl font-bold text-green-600 ml-2">
            {total.toFixed(2)}
          </span>
          บาท
        </p>
  
        <button className="bg-green-600 text-white py-4 rounded w-full mt-4">
          ชำระเงิน
        </button>
      </div>
    );
  }