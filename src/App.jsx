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
import { consoleSnippets } from "./snippets/console-snippets.js";
import * as helpers from "./snippets/helpers.js";

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
          ...iteratorsSnippets,
          ...consoleSnippets
        ].map(snippet => ({
          ...snippet,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }))
      })
    });
  }

  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    if (isRunning) return; // Prevent multiple executions
    setIsRunning(true);
    setOutput("Running...");
    
    // Timeout protection - kill execution after 5 seconds
    const timeoutId = setTimeout(() => {
      setIsRunning(false);
      setOutput(prev => prev + "\n⚠️ Execution timed out (5s limit). Possible infinite loop?");
    }, 5000);
    
    try {
      let logs = [];
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      const formatArg = (arg) => {
        if (typeof arg === 'string') {
          return arg;
        } else {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
      };

      console.log = (...args) => {
        logs.push({ type: 'log', text: args.map(formatArg).join(" ") });
      };
      console.error = (...args) => {
        logs.push({ type: 'error', text: '[ERROR] ' + args.map(formatArg).join(" ") });
      };
      console.warn = (...args) => {
        logs.push({ type: 'warn', text: '[WARN] ' + args.map(formatArg).join(" ") });
      };
      console.info = (...args) => {
        logs.push({ type: 'info', text: '[INFO] ' + args.map(formatArg).join(" ") });
      };

      // Inject helper functions into global scope
      const helperKeys = Object.keys(helpers);
      helperKeys.forEach(key => {
        window[key] = helpers[key];
      });

      eval(code);

      // Clean up
      helperKeys.forEach(key => {
        delete window[key];
      });
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      
      clearTimeout(timeoutId);
      setIsRunning(false);

      const outputText = logs.map(log => log.text).join("\n");
      setOutput(outputText);
      localStorage.setItem('js-compiler-output', outputText);
    } catch (err) {
      clearTimeout(timeoutId);
      setIsRunning(false);
      setOutput("Error: " + err.message);
    }
  };

  const clearOutput = () => {
    setOutput("");
    localStorage.setItem('js-compiler-output', '');
  };
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
          <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
            <button 
              onClick={runCode} 
              disabled={isRunning}
              style={{ opacity: isRunning ? 0.5 : 1 }}
            >
              {isRunning ? "⏳ Running..." : "▶ Run"}
            </button>
            <button onClick={clearOutput}>🗑️ Clear</button>
          </div>

          <h3>Output:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {output.split('\n').map((line, i) => {
              // Check for different output types
              if (line.startsWith('[ERROR]')) {
                return <div key={i} style={{ color: '#ff6b6b' }}>{line.replace('[ERROR]', '')}</div>;
              }
              if (line.startsWith('[WARN]')) {
                return <div key={i} style={{ color: '#ffd93d' }}>{line.replace('[WARN]', '')}</div>;
              }
              if (line.startsWith('[INFO]')) {
                return <div key={i} style={{ color: '#6bcfff' }}>{line.replace('[INFO]', '')}</div>;
              }
              if (line.startsWith('Error:') || line.includes('timed out')) {
                return <div key={i} style={{ color: '#ff6b6b' }}>{line}</div>;
              }
              return <div key={i}>{line}</div>;
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
