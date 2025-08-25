import { useEffect, useState } from "react";
import Table from "./components/Table";

function App() {
  const [users, setUsers] = useState([]);        // Store all users
  const [search, setSearch] = useState("");      // Store search input
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const pageSize = 5;                            // Show 5 rows per page

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Highlight matched search text in table
  const highlightText = (text, query) => {
    if (!query) return text; // if no search → return original text
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-300 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter users by search (name or email)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Define table columns
  const columns = [
    { key: "name", label: "Name", highlight: true },
    { key: "email", label: "Email", highlight: true },
    { key: "city", label: "City", highlight: false },
  ];

  // Format user data for the table
  const tableData = currentUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    city: u.address.city,
  }));

  return (
    <div className="min-h-screen text-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">User Table</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to first page when searching
        }}
        className="border px-3 py-2 mb-4 w-[15%] rounded-md"
      />

      {/* Reusable Table Component */}
      <Table
        data={tableData}
        columns={columns}
        search={search}
        highlightText={highlightText}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
