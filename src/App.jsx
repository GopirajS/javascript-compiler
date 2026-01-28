import React, { useState } from "react";
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
  const [code, setCode] = useState(`console.log("Hello World");`);
  const [output, setOutput] = useState("");
  function handleEditorDidMount(editor, monaco) {
    // Define VS Code Dark Modern theme
    monaco.editor.defineTheme('vscode-dark-modern', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6' }, // Blue keywords (if, for, function, etc.)
        { token: 'type', foreground: '4ec9b0' }, // Teal types
        { token: 'string', foreground: 'ce9178' }, // Orange strings
        { token: 'number', foreground: 'b5cea8' }, // Light green numbers
        { token: 'comment', foreground: '6a9955' }, // Green comments
        { token: 'variable', foreground: '9cdcfe' }, // Light blue variables
        { token: 'function', foreground: 'dcdcaa' }, // Yellow functions
        { token: 'delimiter.parenthesis', foreground: 'ffd700' }, // Gold parentheses
        { token: 'delimiter.bracket', foreground: 'ffd700' }, // Gold brackets
        { token: 'delimiter', foreground: 'ffd700' }, // Gold other delimiters
        { token: 'operator', foreground: 'd4d4d4' } // Light operators
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d30',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#ffffff',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6'
      }
    });

    // Set the theme
    monaco.editor.setTheme('vscode-dark-modern');

    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: () => {
        return {
          suggestions: [
            ...arraySnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...stringSnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...mapSnippets.map(snippet => ({
              ...snippet,
              kind: snippet.label.includes('new') ? monaco.languages.CompletionItemKind.Class : monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...setSnippets.map(snippet => ({
              ...snippet,
              kind: snippet.label.includes('new') ? monaco.languages.CompletionItemKind.Class : monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...mathSnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Function,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...functionSnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...booleanSnippets.map(snippet => ({
              ...snippet,
              kind: snippet.label.includes('new') ? monaco.languages.CompletionItemKind.Class : monaco.languages.CompletionItemKind.Function,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...statementSnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            })),
            ...iteratorsSnippets.map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Method,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }))
          ]
        };
      }
    });
  }


  const runCode = () => {
    try {
      let logs = [];
      const oldLog = console.log;

      console.log = (...args) => logs.push(args.join(" "));
      eval(code);
      console.log = oldLog;

      setOutput(logs.join("\n"));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div style={{ background: "#1e1e1e", minHeight: "100vh", color: "#d4d4d4", padding: "10px" }}>
      <h2>Javascript Compiler</h2>

      <Editor
        height="300px"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value)}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true
        }}
      />

      <button onClick={runCode} style={{ marginTop: "10px", padding: "8px 15px" }}>
        Run Code
      </button>

      <h3>Output:</h3>
      <pre style={{ background: "black", padding: "10px", minHeight: "100px" }}>
        {output}
      </pre>
    </div>
  );
}

export default App;
