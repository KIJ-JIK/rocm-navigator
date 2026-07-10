# ROCm Navigator VS Code Extension

This is the Visual Studio Code extension project codebase for ROCm Navigator, allowing developers to port legacy CUDA files to HIP side-by-side inside their editor.

## Features
* Registers command `ROCm Navigator: Port active CUDA file to AMD HIP` in your editor panel.
* Queries the central API Gateway to translate CUDA memory parameters and cooperative execution blocks.
* Automatically displays the translated HIP code in a side-by-side workspace editor column.
* Includes offline local regex replacement fallbacks if the orchestrator server is unreachable.

## Development Setup & Running
1. Open the `apps/vscode-extension` directory inside VS Code.
2. Run installation commands:
   ```bash
   npm install
   ```
3. Press **F5** to run the extension in a new Extension Development Host window.
4. Open any `.cu` file, open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`), and execute `ROCm Navigator: Port active CUDA file to AMD HIP`!
