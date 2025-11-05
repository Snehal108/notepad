
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();
//   const [spellCheck, setSpellCheck] = useState(false);
//   const [isMonospace, setIsMonospace] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [content, setContent] = useState("");
//   const [noteId, setNoteId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   // Load content from current URL if available

//   useEffect(() => {
//     const currentPath = window.location.pathname;
//     const id = currentPath.split("/note/")[1];
//     if (id) {
//       setNoteId(id);
//       fetch(`/api/notes/${id}`)
//         .then((res) => res.json())
//         .then((data) => setContent(data?.content || ""))
//         .catch(() => console.error("Failed to load note"));
//     }
//   }, []);

//   // Auto-save note when content changes

//   useEffect(() => {
//     if (!noteId) return;
//     const timer = setTimeout(saveNoteToUrl, 800);
//     return () => clearTimeout(timer);
//   }, [content]);

//   async function saveNoteToUrl() {
//     if (!noteId) return;
//     setSaving(true);
//     try {
//       const res = await fetch(`/api/notes/${noteId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content }),
//       });

//       if (!res.ok) {
//         console.error("Failed to save note:", await res.text());
//         alert("Failed to save note");
//       }
//     } catch (err) {
//       console.error("Save error:", err);
//     } finally {
//       setSaving(false);
//     }
//   }

//   // Create new note

//   async function handleNewNote() {
//     try {
//       const res = await fetch("/api/notes", { method: "POST" });
//       const data = await res.json();
//       if (data.id) router.push(`/note/${data.id}`);
//     } catch {
//       alert("Error creating new note");
//     }
//   }

//   // Change URL manually

//   async function handleChangeURL() {
//     const newUrl = prompt("Enter custom URL ID (letters/numbers only):");
//     if (!newUrl) return;

//     try {
//       const res = await fetch(`/api/notes/${newUrl}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content }),
//       });

//       if (res.ok) {
//         setNoteId(newUrl);
//         router.push(`/note/${newUrl}`);
//       } else {
//         alert("Failed to set custom URL");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error setting custom URL");
//     }
//   }

//   function toggleSpellCheck() {
//     setSpellCheck(!spellCheck);
//   }

//   function toggleMonospace() {
//     setIsMonospace(!isMonospace);
//   }

//   function toggleDarkMode() {
//     setIsDarkMode(!isDarkMode);
//   }

//   // Dynamic theme styles

//   const theme = {
//     background: isDarkMode ? "#1e1e1e" : "#f8f9fb",
//     card: isDarkMode ? "#2b2b2b" : "#fff",
//     text: isDarkMode ? "#e0e0e0" : "#333",
//     border: isDarkMode ? "#444" : "#ddd",
//     toolbar: isDarkMode ? "#3a3a3a" : "#fafafa",
//     footer: isDarkMode ? "#2a2a2a" : "#f3f4f6",
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: theme.background,
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: theme.card,
//           width: "85%",
//           height: "85%",
//           border: `1px solid ${theme.border}`,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           borderRadius: "6px",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* --Top Bar-- */}

//         <div
//           style={{
//             backgroundColor: theme.toolbar,
//             borderBottom: `1px solid ${theme.border}`,
//             padding: "8px 16px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* Left Logo */}

//           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//             <span style={{ color: "#c27ad8", fontWeight: "bold", fontSize: "18px" }}>🕊</span>
//             <span
//               style={{
//                 color: isDarkMode ? "#bbb" : "#777",
//                 fontFamily: "Georgia, serif",
//                 fontSize: "17px",
//               }}
//             >
//               notespace
//             </span>
//           </div>

//           {/* Right Icons */}

//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <span style={iconStyle} onClick={handleNewNote} title="New Note">＋</span>
//             <span style={iconStyle} title="Password">🔒</span>
//             <span style={iconStyle} onClick={handleChangeURL} title="Change URL">✏️</span>
//             {/* <span style={iconStyle} title="Account Panel">👤</span> */}
//             <span style={iconStyle} onClick={() => router.push("/account")} title="Account Panel">👤</span>


//             {/* SP Spellcheck Toggle */}

//             <span
//               style={{
//                 ...iconStyle,
//                 color: spellCheck ? "#7b2cbf" : "#999",
//                 fontWeight: spellCheck ? "bold" : "normal",
//               }}
//               onClick={toggleSpellCheck}
//               title="Spell Check (SP)"
//             >
//               SP
//             </span>

//             {/* Monospace Toggle */}

//             <span
//               style={{
//                 ...iconStyle,
//                 color: isMonospace ? "#7b2cbf" : "#999",
//                 fontWeight: isMonospace ? "bold" : "normal",
//               }}
//               onClick={toggleMonospace}
//               title="Monospace Font (MO)"
//             >
//               MO
//             </span>

//             {/* Light/Dark Mode Toggle */}

//             <span
//               style={{
//                 ...iconStyle,
//                 color: isDarkMode ? "#ffe066" : "#999",
//                 fontWeight: isDarkMode ? "bold" : "normal",
//               }}
//               onClick={toggleDarkMode}
//               title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//             >
//               💡
//             </span>

//             <span style={iconStyle} title="Settings">⚙️</span>

//             <button
//               title="Remove Ads"
//               style={{
//                 backgroundColor: "#e7b3f3",
//                 border: "none",
//                 borderRadius: "4px",
//                 padding: "4px 10px",
//                 color: "#fff",
//                 fontSize: "13px",
//                 cursor: "pointer",
//               }}
//             >
//               Remove Ads
//             </button>
//           </div>
//         </div>

//         {/* --Text Area-- */}

//         <div style={{ position: "relative", flex: 1 }}>
//           <textarea
//             spellCheck={spellCheck}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Start typing..."
//             style={{
//               width: "100%",
//               height: "100%",
//               padding: "16px",
//               border: "none",
//               outline: "none",
//               fontSize: "15px",
//               resize: "none",
//               fontFamily: isMonospace ? "monospace" : "sans-serif",
//               color: theme.text,
//               backgroundColor: theme.card,
//             }}
//           ></textarea>

//           {saving && (
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "10px",
//                 left: "16px",
//                 background: "#f3e8ff",
//                 padding: "4px 8px",
//                 borderRadius: "6px",
//                 fontSize: "13px",
//                 color: "#7b2cbf",
//               }}
//             >
//               💾 Saving...
//             </div>
//           )}

//           {/* Bottom-right toolbar */}

//           <div
//             style={{
//               position: "absolute",
//               bottom: "8px",
//               right: "16px",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             <button style={miniButton} title="Expand">↗</button>
//             <button style={miniButton} title="Zoom In">＋</button>
//             <button style={miniButton} title="Zoom Out">－</button>
//             <button style={miniButton} title="Raw Mode">Raw</button>
//             <button style={miniButton} title="Markdown Mode">MarkDown</button>
//             <button style={miniButton} title="Code Mode">Code</button>
//           </div>
//         </div>

//         {/* Footer */}

//         <div
//           style={{
//             backgroundColor: theme.footer,
//             borderTop: `1px solid ${theme.border}`,
//             textAlign: "center",
//             padding: "8px",
//             fontSize: "13px",
//             color: isDarkMode ? "#bbb" : "#777",
//             display: "flex",
//             justifyContent: "center",
//             gap: "14px",
//           }}
//         >
//           <span>Privacy</span>
//           <span>–</span>
//           <span>Terms</span>
//           <span>–</span>
//           <span>Contact Us</span>
//           <span>–</span>
//           <span>About Us</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// const iconStyle = {
//   color: "#999",
//   cursor: "pointer",
//   fontSize: "15px",
//   transition: "color 0.3s ease",
// };

// const miniButton = {
//   background: "#f6f6f6",
//   border: "1px solid #ddd",
//   borderRadius: "4px",
//   padding: "2px 8px",
//   fontSize: "12px",
//   color: "#999",
//   cursor: "pointer",
// };







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [spellCheck, setSpellCheck] = useState(true);
  const [monoFont, setMonoFont] = useState(true);

  const [fontSize, setFontSize] = useState(15); //new font size state

  // Auto-save every second

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!content) return;
      try {
        setSaving(true);
        await fetch("/api/notes/temp", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        setSaving(false);
      } catch (err) {
        console.error("Error saving:", err);
      }
    }, 1000);
    return () => clearTimeout(delay);
  }, [content]);

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

  // Create new note

  async function handleNewNote() {
    try {
      const res = await fetch("/api/notes", { method: "POST" });
      const data = await res.json();
      if (data.id) router.push(`/note/${data.id}`);
    } catch {
      alert("Error creating note");
    }
  }

  // Toggle edit
  function toggleEditable() {
    setIsEditable(!isEditable);
  }

  // Font size handlers
  function increaseFont() {
    setFontSize((prev) => Math.min(prev + 2, 30));
  }

  function decreaseFont() {
    setFontSize((prev) => Math.max(prev - 2, 10));
  }

  return (
    <div
      style={{
        backgroundColor: "#f8f9fb",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          width: "85%",
          height: "85%",
          border: "1px solid #ddd",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* Top Bar */}

        <div
          style={{
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #eee",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
                color: "#777",
                fontFamily: "Georgia, serif",
                fontSize: "17px",
              }}
            >
              notespace
            </span>
          </div>

          {/* Right Icons */}

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={iconStyle}
              onClick={handleNewNote}
              title="New Note"
            >
              ＋
            </span>
            <span style={iconStyle} title="Password Lock">
              🔒
            </span>
            <span
              style={iconStyle}
              onClick={toggleEditable}
              title="Edit Mode"
            >
              ✏️
            </span>
            <span
              style={iconStyle}
              onClick={() => router.push("/account")}
              title="Account Panel"
            >
              👤
            </span>
            <span
              style={textIconStyle}
              onClick={() => setSpellCheck(!spellCheck)}
              title="Spell Check"
            >
              SP
            </span>
            <span
              style={textIconStyle}
              onClick={() => setMonoFont(!monoFont)}
              title="Monospace Font"
            >
              MO
            </span>
            <span style={iconStyle} title="Light Mode / Tips">
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

        {/* Text Area */}

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
              fontSize: `${fontSize}px`,
              resize: "none",
              fontFamily: monoFont ? "monospace" : "sans-serif",
              color: isEditable ? "#333" : "#aaa",
              backgroundColor: isEditable ? "#fff" : "#f7f7f7",
              transition: "font-size 0.2s ease",
            }}
          ></textarea>

          {/* Bottom Right Toolbar */}

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
            <button style={miniButton} onClick={copyShareLink}>
              ↗
            </button>
            <button style={miniButton} onClick={increaseFont}>
              ＋
            </button>
            <button style={miniButton} onClick={decreaseFont}>
              －
            </button>
            <button style={miniButton}>Raw</button>
            <button style={miniButton}>Markdown</button>
            <button style={miniButton}>Code</button>
          </div>

          {/* Status */}

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
            backgroundColor: "#f3f4f6",
            borderTop: "1px solid #ddd",
            textAlign: "center",
            padding: "8px",
            fontSize: "13px",
            color: "#777",
            display: "flex",
            justifyContent: "center",
            gap: "14px",
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

/* --- Styles --- */

const iconStyle: React.CSSProperties = {
  color: "#999",
  cursor: "pointer",
  fontSize: "15px",
  transition: "transform 0.2s, color 0.2s",
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
  color: "#666",
  cursor: "pointer",
  transition: "all 0.2s",
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