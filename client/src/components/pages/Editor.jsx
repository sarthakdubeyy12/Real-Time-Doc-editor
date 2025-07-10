import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../../api/axios";

const socket = io("http://localhost:5001");

const Editor = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await API.get(`/documents/${docId}`);
        setContent(res.data.content);
        setTitle(res.data.title);
      } catch {
        alert("Failed to load document");
      }
    };
    fetchDocument();
  }, [docId]);

  useEffect(() => {
    if (!user?.username) return;

    socket.emit("join-document", { docId, username: user.username });

    socket.on("receive-changes", (newContent) => setContent(newContent));
    socket.on("collaborators", (users) => setCollaborators(users));

    return () => {
      socket.emit("leave-document", { docId, username: user.username });
      socket.off();
    };
  }, [docId, user?.username]);

  const handleContentChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    autoResizeTextarea();

    socket.emit("send-changes", { docId, content: newText });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaving(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        await API.put(`/documents/${docId}`, { content: newText });
        const now = new Date();
        setLastSaved(now.toLocaleTimeString());
      } catch {
        console.error("Save failed");
      } finally {
        setSaving(false);
      }
    }, 5000);
  };

  const handleTitleChange = async () => {
    try {
      await API.put(`/documents/${docId}`, { title });
      setEditingTitle(false);
    } catch {
      alert("Failed to update title");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/documents/${docId}`);
      navigate("/documents");
    } catch {
      alert("Failed to delete document");
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className={`min-h-screen pt-20 px-4 py-8 transition duration-300 ${
      isFullscreen
        ? "bg-black text-white"
        : "bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white"
    }`}>
      <div className="max-w-6xl mx-auto rounded-2xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-8 space-y-6 transition duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleChange}
              autoFocus
              className="text-xl sm:text-2xl font-semibold border-b border-white/40 bg-transparent focus:outline-none text-white w-full sm:w-auto"
            />
          ) : (
            <h2
              className="text-xl sm:text-2xl font-semibold cursor-pointer hover:text-blue-400"
              onClick={() => setEditingTitle(true)}
            >
              📝 {title}
            </h2>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {collaborators.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                👥
                {collaborators.map((name, i) => (
                  <span
                    key={i}
                    className="bg-blue-500/10 text-blue-300 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="bg-gray-900 text-white px-3 py-1 text-sm rounded hover:bg-gray-800 transition"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-700 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your document..."
          className={`w-full min-h-[300px] text-base leading-relaxed font-mono p-4 rounded-lg resize-none focus:outline-none focus:ring-2 ${
            isFullscreen
              ? "bg-black text-white border border-gray-800 focus:ring-indigo-500"
              : "bg-black/10 text-white border border-white/20 focus:ring-blue-500 shadow-md"
          }`}
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300 mt-2 gap-3">
          <div>
            {saving ? (
              <span className="animate-pulse">💾 Saving...</span>
            ) : lastSaved ? (
              <span>✅ Last saved at {lastSaved}</span>
            ) : (
              <span>No changes saved yet</span>
            )}
          </div>
          <div>
            🧠 {content.trim().split(/\s+/).filter(Boolean).length} words · {content.length} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;