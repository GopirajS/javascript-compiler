import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

import { arraySnippets } from "./snippets/array-snippets.js";
import { stringSnippets } from "./snippets/string-snippets.js";
import { mapSnippets } from "./snippets/map-snippets.js";
import { setSnippets } from "./snippets/set-snippets.js";
import { mathSnippets } from "./snippets/math-snippets.js";
import { functionSnippets } from "./snippets/function-snippets.js";
import { booleanSnippets } from "./snippets/boolean-snippets.js";
import { statementSnippets } from "./snippets/statement-snippets.js";
import { iteratorsSnippets } from "./snippets/iteration-snippets.js";

function App() {
  const [code, setCode] = useState(() => localStorage.getItem('js-compiler-code') || `console.log("Hello World");`);
  const [output, setOutput] = useState(() => localStorage.getItem('js-compiler-output') || "");
  const [editorWidth, setEditorWidth] = useState(50);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("vscode-dark-modern", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "comment", foreground: "6a9955" },
        { token: "function", foreground: "dcdcaa" }
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4"
      }
    });

    monaco.editor.setTheme("vscode-dark-modern");

    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: () => ({
        suggestions: [
          ...arraySnippets,
          ...stringSnippets,
          ...mapSnippets,
          ...setSnippets,
          ...mathSnippets,
          ...functionSnippets,
          ...booleanSnippets,
          ...statementSnippets,
          ...iteratorsSnippets
        ].map(snippet => ({
          ...snippet,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }))
      })
    });
  }

  const runCode = () => {
    try {
      let logs = [];
      const oldLog = console.log;

      console.log = (...args) => {
        const formattedArgs = args.map(arg => {
          if (typeof arg === 'string') {
            return arg;
          } else {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
        });
        logs.push(formattedArgs.join(" "));
      };
      eval(code);
      console.log = oldLog;

      const outputText = logs.join("\n");
      setOutput(outputText);
      localStorage.setItem('js-compiler-output', outputText);
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // Resize logic
  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const onDrag = (e) => {
    if (!isDragging.current || isMobile) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setEditorWidth(newWidth);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      style={{
        height: "100vh",
        background: "#1e1e1e",
        color: "#fff",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2 style={{ padding: "10px" }}>JavaScript Compiler</h2>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row"
        }}
      >
        {/* Editor */}
        <div
          style={{
            width: isMobile ? "100%" : `${editorWidth}%`,
            height: isMobile ? "50%" : "100%"
          }}
        >
          <Editor
            height="100%"
            language="javascript"
            value={code}
            onChange={(value) => {
              setCode(value);
              localStorage.setItem('js-compiler-code', value);
            }}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true
            }}
          />
        </div>

        {/* Divider (only desktop) */}
        {!isMobile && (
          <div
            onMouseDown={startDrag}
            style={{
              width: "6px",
              cursor: "col-resize",
              background: "#333"
            }}
          />
        )}

        {/* Output */}
        <div
          style={{
            width: isMobile ? "100%" : `${100 - editorWidth}%`,
            height: isMobile ? "50%" : "95.3%",
            background: "#000",
            padding: "10px",
            overflow: "auto"
          }}
        >
          <button onClick={runCode} style={{ marginBottom: "10px" }}>
            ▶ Run
          </button>

          <h3>Output:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
