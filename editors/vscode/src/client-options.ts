import { workspace, type OutputChannel } from "vscode";
import type { LanguageClient, LanguageClientOptions } from "vscode-languageclient/node.js";

import { createAutoInsertMiddleware } from "./auto-insert.js";
import { createDocumentSelector, type LspInitializationOptions } from "./extension-core.js";
import { withJsxRouting } from "./jsx-routing.js";

export function createClientOptions(
  initializationOptions: LspInitializationOptions,
  getClient: () => LanguageClient | undefined,
  config: ReturnType<typeof workspace.getConfiguration>,
  outputChannel: OutputChannel,
): LanguageClientOptions {
  return {
    documentSelector: createDocumentSelector(),
    synchronize: {
      configurationSection: "vize",
      fileEvents: [
        workspace.createFileSystemWatcher("**/*.vue"),
        workspace.createFileSystemWatcher("**/*.{html,htm}"),
      ],
    },
    outputChannel,
    traceOutputChannel: outputChannel,
    initializationOptions,
    middleware: withJsxRouting(getClient, createAutoInsertMiddleware(getClient, config)),
  };
}
