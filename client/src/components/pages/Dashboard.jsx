import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import React from "react";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const fetchDocs = async () => {
    const res = await API.get("/documents");
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const createDoc = async () => {
    if (!title.trim()) return;
    const res = await API.post("/documents", { title });
    navigate(`/editor/${res.data._id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">📄 Your Documents</h1>

        {/* Create Document Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-md">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new document title"
            className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={createDoc}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold tracking-wide transition"
          >
            Create
          </button>
        </div>

        {/* Documents List */}
        {docs.length === 0 ? (
          <div className="text-center text-gray-400 italic">No documents found. Start by creating one!</div>
        ) : (
          <ul className="space-y-4">
            {docs.map((doc) => (
              <li
                key={doc._id}
                className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-sm flex justify-between items-center hover:border-blue-600 transition-all"
              >
                <div>
                  <h3 className="font-semibold text-lg">{doc.title}</h3>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/editor/${doc._id}`)}
                  className="text-blue-500 font-medium hover:underline transition"
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;