import * as path from "path";
import { Webview, Uri, ExtensionContext } from "vscode";

export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getHtmlForWebview(
  webview: Webview,
  context: ExtensionContext
): string {
  const vuerdUri = webview.asWebviewUri(
    Uri.file(path.join(context.extensionPath, "static", "vuerd.min.js"))
  );
  const mainUri = webview.asWebviewUri(
    Uri.file(path.join(context.extensionPath, "static", "main.js"))
  );
  const nonce = getNonce();
  const cspSource = webview.cspSource;

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" 
      content="default-src * ${cspSource} https: 'unsafe-inline' 'unsafe-eval';
        script-src ${cspSource} blob: data: https: 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}';
        style-src ${cspSource} https: 'unsafe-inline';
        img-src ${cspSource} data: https:;
        connect-src ${cspSource} blob: data: https: http:;">          
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vuerd</title>
    </head>
    <body>
      <div id="app"></div>
      <script nonce="${nonce}" src=${vuerdUri}></script>
      <script nonce="${nonce}" src=${mainUri}></script>
    </body>
    </html>`;
}