const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const vscode = require("vscode");

const {
  assertPackagedExtension,
  assertStaysDiagnosticFree,
  getWorkspaceFolderPath,
  openWorkspaceDocument,
  positionAfter,
  waitFor,
  waitForDiagnostics,
} = require("./real-server-support.cjs");

exports.run = async function run() {
  const enabled = process.env.VIZE_TEST_JSX_ENABLED === "true";
  const extension = vscode.extensions.getExtension("ubugeeei.vize");
  assert.ok(extension);
  assertPackagedExtension(extension);
  // Do not activate the extension or call a contributed command: opening TSX
  // must be sufficient even though this workspace contains no Vue/HTML files.
  const document = await openWorkspaceDocument("App.tsx");
  await vscode.window.showTextDocument(document);
  await waitFor(() => extension.isActive, Boolean, "TSX language activation", 30_000);
  await waitFor(
    async () => {
      try {
        return await vscode.commands.executeCommand("vize.test.getServerInfo");
      } catch {
        return undefined;
      }
    },
    (info) => info?.status === "ready",
    "real Vize server ready",
    60_000,
  );
  assert.equal(document.languageId, "typescriptreact");
  await verifyDocument(document, enabled);
  const jsx = await openWorkspaceDocument("Sibling.jsx");
  await vscode.window.showTextDocument(jsx);
  assert.equal(jsx.languageId, "javascriptreact");
  await verifyDocument(jsx, enabled);
  await vscode.commands.executeCommand("vize.disable");
  console.log(
    `[vize-host-real] TSX/JSX activation, routing and lifecycle (jsxTypecheck=${enabled}) passed`,
  );
};

async function verifyDocument(document, enabled) {
  if (!enabled) {
    await assertStaysDiagnosticFree(document.uri, "JSX opt-in disabled");
    assert.equal(
      await completion(document),
      null,
      "Vize must not receive the disabled JSX document",
    );
    return;
  }
  const diagnostics = await waitForDiagnostics(
    document.uri,
    (next) => next.some((item) => item.source === "vize/types" && item.code === 2322),
    "real JSX type mismatch after didOpen",
    60_000,
  );
  const mismatch = diagnostics.filter((item) => item.source === "vize/types");
  assert.equal(mismatch.length, 1, JSON.stringify(diagnostics));
  assert.equal(mismatch[0].message, "Type 'number' is not assignable to type 'string'.");
  const wrong = document.getText().indexOf("wrong");
  assert.deepEqual(
    mismatch[0].range,
    new vscode.Range(document.positionAt(wrong), document.positionAt(wrong + "wrong".length)),
  );

  const completions = await completion(document);
  const items = Array.isArray(completions) ? completions : completions?.items;
  assert.ok(
    items?.some((item) => item.label === "label"),
    JSON.stringify(completions),
  );
  const definitions = await request(
    "textDocument/definition",
    document,
    positionAfter(document, "account.label", "account.la"),
  );
  const locations = Array.isArray(definitions) ? definitions : [definitions];
  const modelUri = vscode.Uri.file(path.join(getWorkspaceFolderPath(), "model.ts")).toString();
  assert.deepEqual(locations, [
    {
      uri: modelUri,
      range: {
        start: { line: 0, character: 25 },
        end: { line: 0, character: 30 },
      },
    },
  ]);

  const expected = propertyLocations();
  const references = await request(
    "textDocument/references",
    document,
    positionAfter(document, "account.label", "account.la"),
    { context: { includeDeclaration: true } },
  );
  assert.deepEqual(sortLocations(references), expected);
  const rename = await request(
    "textDocument/rename",
    document,
    positionAfter(document, "account.label", "account.la"),
    { newName: "displayName" },
  );
  const edits = Object.entries(rename?.changes ?? {}).flatMap(([uri, entries]) =>
    entries.map((edit) => ({ uri, range: edit.range, newText: edit.newText })),
  );
  for (const change of rename?.documentChanges ?? []) {
    assert.ok(change.textDocument, JSON.stringify(rename));
    edits.push(
      ...change.edits.map((edit) => ({
        uri: change.textDocument.uri,
        range: edit.range,
        newText: edit.newText,
      })),
    );
  }
  assert.deepEqual(
    sortLocations(edits),
    expected.map((location) => ({
      ...location,
      newText: "displayName",
    })),
  );

  const editor = await vscode.window.showTextDocument(document);
  const offset = document.getText().indexOf("= 1;") + 2;
  assert.ok(offset > 1);
  assert.equal(
    await editor.edit((edit) =>
      edit.replace(
        new vscode.Range(document.positionAt(offset), document.positionAt(offset + 1)),
        '"fixed"',
      ),
    ),
    true,
  );
  await waitForDiagnostics(
    document.uri,
    (next) => next.every((item) => item.source !== "vize/types"),
    "unsaved didChange clears JSX type error",
    60_000,
  );
  assert.equal(document.isDirty, true);
  const repaired = await completion(document);
  assert.ok(
    (Array.isArray(repaired) ? repaired : repaired?.items)?.some((item) => item.label === "label"),
  );
  await vscode.commands.executeCommand("workbench.action.revertAndCloseActiveEditor");
  const reopened = await vscode.workspace.openTextDocument(document.uri);
  await vscode.window.showTextDocument(reopened);
  await waitForDiagnostics(
    reopened.uri,
    (next) => next.some((item) => item.source === "vize/types" && item.code === 2322),
    "didClose and reopen restore the authored disk error",
    60_000,
  );
}

function completion(document) {
  return request(
    "textDocument/completion",
    document,
    positionAfter(document, "account.label", "account.l"),
  );
}

function request(method, document, position, extra = {}) {
  return vscode.commands.executeCommand("vize.test.executeLspRequest", {
    method,
    params: {
      ...extra,
      textDocument: { uri: document.uri.toString() },
      position: {
        line: position.line,
        character: position.character,
      },
    },
  });
}

function propertyLocations() {
  return sortLocations(
    ["model.ts", "App.tsx", "Sibling.jsx"].map((filename) => {
      const filePath = path.join(getWorkspaceFolderPath(), filename);
      const source = fs.readFileSync(filePath, "utf8");
      const offset =
        filename === "model.ts"
          ? source.indexOf("label:")
          : source.indexOf("account.label") + "account.".length;
      assert.ok(offset >= 0, filename);
      const preceding = source.slice(0, offset).split("\n");
      const start = { line: preceding.length - 1, character: preceding.at(-1).length };
      return {
        uri: vscode.Uri.file(filePath).toString(),
        range: { start, end: { ...start, character: start.character + "label".length } },
      };
    }),
  );
}

function sortLocations(locations) {
  assert.ok(Array.isArray(locations), JSON.stringify(locations));
  return [...locations].sort(
    (a, b) =>
      a.uri.localeCompare(b.uri) ||
      a.range.start.line - b.range.start.line ||
      a.range.start.character - b.range.start.character,
  );
}
