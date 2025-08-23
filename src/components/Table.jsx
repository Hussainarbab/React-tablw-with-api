import { useState, useMemo } from "react";

export default function Table({ data }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Sorted data based on column click
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search name/email..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          className="border p-2 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort("email")}>
              Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2">City</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(user => (
            <tr key={user.id} className="border hover:bg-gray-100">
              <td className="border p-2">{search ? <Highlight text={user.name} highlight={search} /> : user.name}</td>
              <td className="border p-2">{search ? <Highlight text={user.email} highlight={search} /> : user.email}</td>
              <td className="border p-2">{user.address?.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Highlight matching text in search
function Highlight({ text, highlight }) {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? "bg-yellow-200" : ""}>
          {part}
        </span>
      ))}
    </>
  );
}
