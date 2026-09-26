import type { TextDocument } from "vscode";
import type { LanguageClient, Middleware } from "vscode-languageclient/node.js";

export function isJsxDocument(document: Pick<TextDocument, "languageId">): boolean {
  return document.languageId === "typescriptreact" || document.languageId === "javascriptreact";
}

/** The server resolves JSON and Pkl configuration; the client never guesses it. */
export function admitsDocument(
  document: Pick<TextDocument, "languageId">,
  client: Pick<LanguageClient, "initializeResult"> | undefined,
): boolean {
  if (!isJsxDocument(document)) return true;
  const experimental = client?.initializeResult?.capabilities.experimental as
    | { vize?: { jsxTypecheck?: unknown } }
    | undefined;
  return experimental?.vize?.jsxTypecheck === true;
}

export function withJsxRouting(
  getClient: () => LanguageClient | undefined,
  middleware: Middleware,
): Middleware {
  return {
    ...middleware,
    async didOpen(document, next) {
      if (admitsDocument(document, getClient())) await next(document);
    },
    async didChange(event, next) {
      if (!admitsDocument(event.document, getClient())) return;
      if (middleware.didChange) await middleware.didChange(event, next);
      else await next(event);
    },
    async didClose(document, next) {
      if (admitsDocument(document, getClient())) await next(document);
    },
    async didSave(document, next) {
      if (admitsDocument(document, getClient())) await next(document);
    },
  };
}
