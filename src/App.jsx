import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const highlightText = (text, query) => {
    if (!query) return text;
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
// search 
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4"> Table Task</h1>

      
      <input
        type="text"
        placeholder="Search  name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 mb-4 w-[15%] rounded-md"
      />

      <table className="min-w-[60%] border border-gray-300 ml-[20%] bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">City</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                {highlightText(user.name, search)}
              </td>
              <td className="border px-4 py-2">
                {highlightText(user.email, search)}
              </td>
              <td className="border px-4 py-2">{user.address.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
