export const statementSnippets = [
  { label: "break", insertText: "break;" },

  { label: "class", insertText: "class ${1:ClassName} {\n  constructor() {\n    ${2:// code}\n  }\n}" },

  { label: "const", insertText: "const ${1:name} = ${2:value};" },

  { label: "continue", insertText: "continue;" },

  { label: "debugger", insertText: "debugger;" },

  { label: "do...while", insertText: "do {\n  ${1:// code}\n} while (${2:condition});" },

  { label: "for", insertText: "for (let ${1:i} = 0; ${1:i} < ${2:limit}; ${1:i}++) {\n  ${3:// code}\n}" },

  { label: "for...in", insertText: "for (let ${1:key} in ${2:object}) {\n  ${3:// code}\n}" },

  { label: "for...of", insertText: "for (let ${1:item} of ${2:array}) {\n  ${3:// code}\n}" },

  { label: "function", insertText: "function ${1:name}(${2:params}) {\n  ${3:// code}\n}" },

  { label: "if...else", insertText: "if (${1:condition}) {\n  ${2:// code}\n} else {\n  ${3:// code}\n}" },

  { label: "let", insertText: "let ${1:name} = ${2:value};" },

  { label: "return", insertText: "return ${1:value};" },

  { label: "switch", insertText: "switch (${1:value}) {\n  case ${2:caseValue}:\n    ${3:// code}\n    break;\n  default:\n    ${4:// code}\n}" },

  { label: "throw", insertText: "throw new Error(${1:\"message\"});" },

  { label: "try...catch", insertText: "try {\n  ${1:// code}\n} catch (${2:error}) {\n  console.error(${2:error});\n}" },

  { label: "var", insertText: "var ${1:name} = ${2:value};" },

  { label: "while", insertText: "while (${1:condition}) {\n  ${2:// code}\n}" }
];
