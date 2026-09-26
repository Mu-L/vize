import assert from "node:assert/strict";
import { test } from "node:test";
import type { TextDocument, TextDocumentChangeEvent } from "vscode";
import type { LanguageClient } from "vscode-languageclient/node.js";

import { admitsDocument, withJsxRouting } from "../../editors/vscode/src/jsx-routing.ts";

test("JSX documents require the real server's resolved boolean opt-in", () => {
  for (const languageId of ["typescriptreact", "javascriptreact"]) {
    assert.equal(admitsDocument({ languageId }, undefined), false);
    for (const enabled of [undefined, false, "true", 1]) {
      assert.equal(admitsDocument({ languageId }, server(enabled)), false);
    }
    assert.equal(admitsDocument({ languageId }, server(true)), true);
  }
  assert.equal(admitsDocument({ languageId: "vue" }, undefined), true);
  assert.equal(admitsDocument({ languageId: "html" }, server(false)), true);
});

test("JSX lifecycle respects admission and preserves the existing didChange middleware", async () => {
  for (const enabled of [false, true]) {
    const document = { languageId: "typescriptreact" } as TextDocument;
    const event = { document } as TextDocumentChangeEvent;
    const delivered: unknown[] = [];
    const next = async (value: unknown) => {
      delivered.push(value);
    };
    let changes = 0;
    const middleware = withJsxRouting(() => server(enabled), {
      async didChange(change, forward) {
        changes++;
        await forward(change);
      },
    });
    await middleware.didOpen!(document, next);
    await middleware.didChange!(event, next);
    await middleware.didSave!(document, next);
    await middleware.didClose!(document, next);
    assert.deepEqual(delivered, enabled ? [document, event, document, document] : []);
    assert.equal(changes, enabled ? 1 : 0);
  }
});

function server(enabled: unknown): LanguageClient {
  return {
    initializeResult: { capabilities: { experimental: { vize: { jsxTypecheck: enabled } } } },
  } as LanguageClient;
}
