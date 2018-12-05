#!/bin/bash
echo -e "\nChecking if Visual studio code command is installed:"
if ! [ -x "$(command -v code)" ]; then
  echo -e '\nError: code command not found.'
  echo -e "\n1. In VS Code press CMD+SHIFT+P"
  echo -e "\n2. Search and select \"Install 'code' command in PATH\""
  echo -e "\nDo npm install again."
  exit 0
fi

echo -e "Installing recommended vscode extensions:"
echo -e "\nBabel ES6/ES7"
code --install-extension dzannotti.vscode-babel-coloring --force
echo -e "\nESLint"
code --install-extension dbaeumer.vscode-eslint --force
echo -e "\nPrettier - Code formatter"
code --install-extension esbenp.prettier-vscode --force
echo -e "\nEditorConfig for VS Code"
code --install-extension EditorConfig.EditorConfig --force
echo -e "\nDebugger for chrome"
code --install-extension msjsdiag.debugger-for-chrome --force
