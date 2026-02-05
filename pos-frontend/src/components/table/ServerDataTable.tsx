import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";

type ServerDataTableProps = {
  columns: any[];
  fetchData: (params: {
    page: number;
    perPage: number;
    search: string;
  }) => Promise<{ data: any[]; total: number }>;
  reload: number;
};

export default function ServerDataTable({
  columns,
  fetchData,
  reload,
}: ServerDataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    const res = await fetchData({ page, perPage, search });
    setData(res.data);
    setTotalRows(res.total);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, perPage, search, reload]);

  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={setPage}
      onChangeRowsPerPage={(newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
      }}
      subHeader
      subHeaderComponent={
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    />
  );
}