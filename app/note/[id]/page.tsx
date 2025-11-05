
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [spellCheck, setSpellCheck] = useState(true);
  const [monoFont, setMonoFont] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch existing note content on load

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    }
    if (id) fetchNote();
  }, [id]);

  // Auto-save every second

  useEffect(() => {
    if (!id) return;
    const delay = setTimeout(async () => {
      try {
        setSaving(true);
        await fetch(`/api/notes/${id}`, {
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
  }, [content, id]);

  // Copy link to clipboard

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("✅ Link copied!");
      setTimeout(() => setShareMessage(""), 2000);
    } catch {
      setShareMessage("❌ Failed to copy");
    }
  }

  // Create new note

  async function handleNewNote() {
    try {
      const res = await fetch("/api/notes", { method: "POST" });
      const data = await res.json();
      if (data.id) router.push(`/note/${data.id}`);
    } catch {
      alert("Error creating new note");
    }
  }

  // Toggle editable
  function toggleEditable() {
    setIsEditable(!isEditable);
  }

  // Toggle spell check
  function toggleSpellCheck() {
    setSpellCheck(!spellCheck);
  }

  // Toggle light/dark mode
  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#1f1f1f" : "#f8f9fb",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: isDarkMode ? "#ddd" : "#000",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#2b2b2b" : "#fff",
          width: "85%",
          height: "85%",
          border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
          boxShadow: isDarkMode
            ? "0 2px 8px rgba(255,255,255,0.05)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s",
        }}
      >
        {/* -- Top Bar -- */}

        <div
          style={{
            backgroundColor: isDarkMode ? "#333" : "#fafafa",
            borderBottom: isDarkMode ? "1px solid #555" : "1px solid #eee",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "background-color 0.3s",
          }}
        >
          {/* Left Logo */}

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                color: "#c27ad8",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              🕊
            </span>
            <span
              style={{
                color: isDarkMode ? "#ddd" : "#777",
                fontFamily: "Georgia, serif",
                fontSize: "17px",
              }}
            >
              notespace
            </span>
          </div>

          {/* Right Icons */}

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={iconStyle} onClick={handleNewNote} title="New Note">
              ＋
            </span>
            <span style={iconStyle} title="Password Lock">
              🔒
            </span>
            <span
              style={iconStyle}
              onClick={toggleEditable}
              title="Change URL"
            >
              ✏️
            </span>
            {/* <span style={iconStyle} title="Account Panel">
              👤
            </span> */}
            <span style={iconStyle} onClick={() => router.push("/account")} title="Account Panel">👤</span>

            <span
              style={textIconStyle}
              onClick={toggleSpellCheck}
              title="Spell Check (SP)"
            >
              SP
            </span>
            <span
              style={textIconStyle}
              onClick={() => setMonoFont(!monoFont)}
              title="Monospace Font (MO)"
            >
              MO
            </span>
            <span
              style={iconStyle}
              onClick={toggleDarkMode}
              title="Light / Dark Mode 💡"
            >
              💡
            </span>
            <span style={iconStyle} title="Settings">
              ⚙️
            </span>
            <button style={removeAdBtn} title="Remove Ads">
              Remove Ads
            </button>
          </div>
        </div>

        {/* -- Text Area -- */}

        <div style={{ position: "relative", flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            readOnly={!isEditable}
            spellCheck={spellCheck}
            style={{
              width: "100%",
              height: "100%",
              padding: "16px",
              border: "none",
              outline: "none",
              fontSize: "15px",
              resize: "none",
              fontFamily: monoFont ? "monospace" : "sans-serif",
              color: isDarkMode ? "#ddd" : "#333",
              backgroundColor: isDarkMode
                ? isEditable
                  ? "#1e1e1e"
                  : "#2a2a2a"
                : isEditable
                ? "#fff"
                : "#f7f7f7",
              transition: "all 0.3s",
            }}
          ></textarea>

          {/* Toolbar */}

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
            <button style={miniButton}>↗</button>
            <button style={miniButton}>＋</button>
            <button style={miniButton}>－</button>
            <button style={miniButton}>Raw</button>
            <button style={miniButton}>MarkDown</button>
            <button style={miniButton}>Code</button>
          </div>

          {/* Save/copy message */}

          {saving && <div style={statusBubble}>💾 Saving...</div>}
          {shareMessage && (
            <div style={{ ...statusBubble, background: "#c27ad8" }}>
              {shareMessage}
            </div>
          )}
        </div>

        {/* -- Footer -- */}

        <div
          style={{
            backgroundColor: isDarkMode ? "#333" : "#f3f4f6",
            borderTop: isDarkMode ? "1px solid #555" : "1px solid #ddd",
            textAlign: "center",
            padding: "8px",
            fontSize: "13px",
            color: isDarkMode ? "#ccc" : "#777",
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            transition: "background-color 0.3s",
          }}
        >
          <span>Privacy</span>
          <span>–</span>
          <span>Terms</span>
          <span>–</span>
          <span>Contact Us</span>
          <span>–</span>
          <span>About Us</span>
        </div>
      </div>
    </div>
  );
}

/* -- Reusable Styles -- */

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
  transition: "color 0.2s",
};

const miniButton: React.CSSProperties = {
  background: "#f6f6f6",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "2px 8px",
  fontSize: "12px",
  color: "#999",
  cursor: "pointer",
};

const removeAdBtn: React.CSSProperties = {
  backgroundColor: "#e7b3f3",
  border: "none",
  borderRadius: "4px",
  padding: "4px 10px",
  color: "#fff",
  fontSize: "13px",
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
