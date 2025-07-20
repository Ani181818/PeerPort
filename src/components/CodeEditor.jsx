import { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";

const CodeEditor = ({ userId, targetUserId, socket }) => {
  const [code, setCode] = useState("// Welcome to collaborative coding!\n// Start typing your code here...\n\n");
  const [language, setLanguage] = useState("javascript");
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [collaboratorCursor, setCollaboratorCursor] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for code changes from other user
    socket.on("codeChanged", ({ newCode, cursorPosition }) => {
      if (!isTyping) {
        setCode(newCode);
        setCollaboratorCursor(cursorPosition);
      }
    });

    // Listen for language changes
    socket.on("languageChanged", ({ newLanguage }) => {
      setLanguage(newLanguage);
    });

    // Listen for cursor position updates
    socket.on("cursorMoved", ({ cursorPosition }) => {
      setCollaboratorCursor(cursorPosition);
    });

    return () => {
      socket.off("codeChanged");
      socket.off("languageChanged");
      socket.off("cursorMoved");
    };
  }, [socket, isTyping]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setCode(newCode);
    setIsTyping(true);

    // Emit code change to other user
    socket?.emit("codeChange", {
      userId,
      targetUserId,
      code: newCode,
      cursorPosition
    });

    // Reset typing flag after a short delay
    setTimeout(() => setIsTyping(false), 100);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    socket?.emit("languageChange", {
      userId,
      targetUserId,
      language: newLanguage
    });
  };

  const handleCursorMove = (e) => {
    const cursorPosition = e.target.selectionStart;
    
    socket?.emit("cursorMove", {
      userId,
      targetUserId,
      cursorPosition
    });
  };

  const runCode = () => {
    // Simple code execution simulation
    try {
      if (language === "javascript") {
        // Create a safe evaluation context
        const result = eval(code);
        alert(`Output: ${result}`);
      } else {
        alert("Code execution is only supported for JavaScript in this demo");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const clearCode = () => {
    const newCode = "";
    setCode(newCode);
    socket?.emit("codeChange", {
      userId,
      targetUserId,
      code: newCode,
      cursorPosition: 0
    });
  };

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Code Editor Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Code Editor</h3>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={runCode}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium transition"
          >
            Run
          </button>
          <button
            onClick={clearCode}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onSelect={handleCursorMove}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none outline-none border-none"
          placeholder="Start coding here..."
          spellCheck={false}
        />
        
        {/* Collaborator cursor indicator */}
        {collaboratorCursor !== null && (
          <div
            className="absolute w-0.5 h-5 bg-yellow-400 pointer-events-none"
            style={{
              left: `${4 + (collaboratorCursor % 80) * 8}px`,
              top: `${16 + Math.floor(collaboratorCursor / 80) * 20}px`,
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
        <span>Language: {language}</span>
        <span>Lines: {code.split('\n').length}</span>
        <span>Characters: {code.length}</span>
      </div>
    </div>
  );
};

export default CodeEditor;