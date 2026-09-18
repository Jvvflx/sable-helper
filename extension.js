const vscode = require('vscode');
const path = require('path');

async function activate(context) {
  const jarPath = path.join(context.extensionPath, 'third-party', 'sablecc-3.7', 'lib', 'sablecc.jar');

  const disposable = vscode.commands.registerCommand('sableHelper.runSableCC', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'sablecc') {
      vscode.window.showWarningMessage('Abra um arquivo .sable para rodar o SableCC.');
      return;
    }

    const filePath = editor.document.fileName;

    const terminal = vscode.window.createTerminal('SableCC');
    terminal.show();
    terminal.sendText(`java -jar "${jarPath}" "${filePath}"`);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };