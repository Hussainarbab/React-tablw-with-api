
function Table({ data, columns, search, highlightText }) {
  return (
    <table className="min-w-[60%] border border-gray-300 ml-[20%] bg-white mt-4">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col) => (
            <th key={col.key} className="border px-4 py-2 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="border px-4 py-2">
                {col.highlight
                  ? highlightText(row[col.key], search)
                  : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
