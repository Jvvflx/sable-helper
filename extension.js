const vscode = require('vscode');
const path = require('path');
const fs = require('fs/promises');

async function activate(context) {
  const jarPath = path.join(context.extensionPath, 'third-party', 'sablecc-3.7', 'lib', 'sablecc.jar');

  // Pastas que o SableCC costuma gerar (baseadas no pacote definido no .sable)
  const GENERATED_FOLDERS = ['analysis', 'lexer', 'node', 'parser'];

  async function limparArquivosGerados(baseDir) {
    for (const folder of GENERATED_FOLDERS) {
      const targetPath = path.join(baseDir, folder);
      try {
        await fs.rm(targetPath, { recursive: true, force: true });
      } catch (err) {
        // Ignora se a pasta não existir; loga qualquer outro erro
        if (err.code !== 'ENOENT') {
          console.error(`Falha ao remover ${targetPath}:`, err);
        }
      }
    }
  }

  const disposable = vscode.commands.registerCommand('sableHelper.runSableCC', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'sablecc') {
      vscode.window.showWarningMessage('Abra um arquivo .sable para rodar o SableCC.');
      return;
    }

    const filePath = editor.document.fileName;
    const baseDir = path.dirname(filePath);

    try {
      await limparArquivosGerados(baseDir);
    } catch (err) {
      vscode.window.showErrorMessage(`Erro ao limpar arquivos anteriores: ${err.message}`);
      return;
    }

    const terminal = vscode.window.createTerminal('SableCC');
    terminal.show();
    terminal.sendText(`java -jar "${jarPath}" "${filePath}"`);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };