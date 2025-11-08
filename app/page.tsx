"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
  const noteId = pathname === "/" ? "home" : pathname.replace("/", "");

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [spellCheck, setSpellCheck] = useState(true);
  const [monoFont, setMonoFont] = useState(true);
  const [fontSize, setFontSize] = useState(15);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showChangeUrlModal, setShowChangeUrlModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  // Fetch note on load

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    }
    if (noteId) fetchNote();
  }, [noteId]);

  // Auto-save when content changes

  useEffect(() => {
    if (!noteId) return;
    const delay = setTimeout(async () => {
      try {
        setSaving(true);
        await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        setSaving(false);
      } catch (err) {
        console.error("Error saving note:", err);
      }
    }, 1000);
    return () => clearTimeout(delay);
  }, [content, noteId]);

  // Copy shareable link
  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("✅ Link copied!");
      setTimeout(() => setShareMessage(""), 2000);
    } catch {
      setShareMessage("❌ Failed to copy");
    }
  }

  // Change URL handler
  function handleChangeUrl() {
    if (newUrl.trim()) {
      window.location.href = `/${newUrl}`;
    }
  }

  // Font size controls
  function increaseFont() {
    setFontSize((prev) => Math.min(prev + 2, 30));
  }
  function decreaseFont() {
    setFontSize((prev) => Math.max(prev - 2, 10));
  }

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  function handleAddNewNote() {
    const newNoteId = Math.random().toString(36).substring(2, 8);
    router.push(`/note/${newNoteId}`);
  }

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f8f9fb",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.3s ease",
        color: isDarkMode ? "#ddd" : "#333",
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#2b2b2b" : "#fff",
          width: "85%",
          height: "85%",
          border: isDarkMode ? "1px solid #555" : "1px solid #ddd",
          boxShadow: isDarkMode
            ? "0 2px 10px rgba(255,255,255,0.1)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >

        {/* Top Bar */}

        <div
          style={{
            backgroundColor: isDarkMode ? "#333" : "#fafafa",
            borderBottom: isDarkMode ? "1px solid #444" : "1px solid #eee",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#c27ad8", fontWeight: "bold", fontSize: "18px" }}>🕊</span>
            <span
              style={{
                color: isDarkMode ? "#ccc" : "#777",
                fontFamily: "Georgia, serif",
                fontSize: "17px",
              }}
            >
              notespace
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={iconStyle} onClick={handleAddNewNote} title="New Note">＋</span>
            <span style={iconStyle} onClick={() => setShowPasswordModal(true)} title="Password">🔒</span>
            <span style={iconStyle} onClick={() => setShowChangeUrlModal(true)} title="Change URL">✏️</span>
            <span style={iconStyle} onClick={() => router.push("/account")} title="Account Panel">👤</span>
            <span style={textIconStyle} onClick={() => setSpellCheck(!spellCheck)} title="Spell Check">SP</span>
            <span style={textIconStyle} onClick={() => setMonoFont(!monoFont)} title="Monospace Font">MO</span>
            <span style={iconStyle} onClick={toggleDarkMode} title="Light / Dark Mode">💡</span>
            <span style={iconStyle} onClick={copyShareLink} title="Copy URL">🔗</span>
          </div>
        </div>

        {/* Text Area */}

        <div style={{ position: "relative", flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={!isEditable}
            spellCheck={spellCheck}
            placeholder="Start typing..."
            style={{
              width: "100%",
              height: "100%",
              padding: "16px",
              border: "none",
              outline: "none",
              fontSize: `${fontSize}px`,
              resize: "none",
              fontFamily: monoFont ? "monospace" : "sans-serif",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              color: isDarkMode ? "#ddd" : "#333",
              transition: "all 0.3s ease",
            }}
          ></textarea>

          {/* Bottom Toolbar */}

          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <button style={miniButton} onClick={increaseFont}>＋</button>
            <button style={miniButton} onClick={decreaseFont}>－</button>
          </div>

          {saving && <div style={statusBubble}>💾 Saving...</div>}
          {shareMessage && (
            <div style={{ ...statusBubble, background: "#c27ad8" }}>
              {shareMessage}
            </div>
          )}
        </div>

        {/* Footer */}

        <div
          style={{
            backgroundColor: isDarkMode ? "#222" : "#f3f4f6",
            borderTop: isDarkMode ? "1px solid #444" : "1px solid #ddd",
            textAlign: "center",
            padding: "8px",
            fontSize: "13px",
            color: isDarkMode ? "#aaa" : "#777",
            display: "flex",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          <span>Privacy</span>
          <span>–</span>
          <span>Terms</span>
          <span>–</span>
          <span>Contact</span>
          <span>–</span>
          <span>About</span>
        </div>

        {/* Password Modal */}

        {showPasswordModal && (
          <div style={modalOverlay}>
            <div style={{ ...modalBox, backgroundColor: isDarkMode ? "#2b2b2b" : "#fff" }}>
              <h3>🔒 Set Password</h3>
              <input type="password" placeholder="Enter password..." style={modalInput} />
              <div style={{ marginTop: "10px" }}>
                <button style={miniButton} onClick={() => setShowPasswordModal(false)}>Close</button>
                <button style={{ ...miniButton, background: "#c27ad8", color: "#fff", marginLeft: "8px" }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Change URL Modal */}

        {showChangeUrlModal && (
          <div style={modalOverlay}>
            <div style={{ ...modalBox, backgroundColor: isDarkMode ? "#2b2b2b" : "#fff" }}>
              <h3>✏️ Change URL</h3>
              <input
                type="text"
                placeholder="Enter new URL..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                style={modalInput}
              />
              <div style={{ marginTop: "10px" }}>
                <button style={miniButton} onClick={() => setShowChangeUrlModal(false)}>Cancel</button>
                <button
                  style={{ ...miniButton, background: "#c27ad8", color: "#fff", marginLeft: "8px" }}
                  onClick={handleChangeUrl}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Styles --- */

const iconStyle: React.CSSProperties = {
  color: "#999",
  cursor: "pointer",
  fontSize: "15px",
  transition: "color 0.2s",
};
const textIconStyle: React.CSSProperties = {
  color: "#999",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: "500",
};
const miniButton: React.CSSProperties = {
  background: "#f6f6f6",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "2px 8px",
  fontSize: "12px",
  color: "#666",
  cursor: "pointer",
};
const statusBubble: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "20px",
  background: "#e0b8f2",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 100,
};
const modalBox: React.CSSProperties = {
  borderRadius: "8px",
  padding: "24px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};
const modalInput: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};