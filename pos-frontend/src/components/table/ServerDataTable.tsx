// ServerDataTable.tsx
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
  title: string;
  searchInput: string;
};

export default function ServerDataTable({
  columns,
  fetchData,
  reload,
  title,
  searchInput,
}: ServerDataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchData({
      page,
      perPage,
      search: searchInput,
    });
    setData(res.data);
    setTotalRows(res.total);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, perPage, searchInput, reload]);
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
        <small className="text-sm text-gray-500 flex justify-end">
          { title}
        </small>
      }
    />
  );
}