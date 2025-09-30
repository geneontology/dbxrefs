import assert from "node:assert";
import { before, mock, test } from "node:test";

import * as dbxrefs from "../src/main.js";

before(() => {
  mock.method(global, "fetch", async (url: string) => {
    if (url === "https://current.geneontology.org/metadata/db-xrefs.json") {
      const body = [
        {
          database: "testdb",
          synonyms: ["testdbsyn"],
          entity_types: [
            {
              type_name: "gene",
              url_syntax: "https://example.com/gene/[example_id]",
            },
            {
              type_name: "protein",
              url_syntax: "https://example.com/protein/[example_id]",
            },
            {
              type_name: "no_url_syntax",
            },
          ],
        },
      ];
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw new Error("Unexpected URL: " + url);
  });
});

test("isReady returns false by default", () => {
  assert.strictEqual(dbxrefs.isReady(), false);
});

test("isReady returns true after initialization", async () => {
  await dbxrefs.init();
  assert.strictEqual(dbxrefs.isReady(), true);
  assert.strictEqual(dbxrefs.hasError(), false);
});

test("getUrl returns correct url when no entity type is given", () => {
  assert.strictEqual(
    dbxrefs.getURL("testdb", undefined, "12345"),
    "https://example.com/gene/12345",
  );
});

test("getUrl returns correct url when entity type is given", () => {
  assert.strictEqual(
    dbxrefs.getURL("testdb", "protein", "12345"),
    "https://example.com/protein/12345",
  );
});

test("getUrl returns correct url when database synonym is used", () => {
  assert.strictEqual(
    dbxrefs.getURL("testdbsyn", undefined, "12345"),
    "https://example.com/gene/12345",
  );
});

test("getUrl returns undefined for unknown database", () => {
  assert.strictEqual(dbxrefs.getURL("unknown", undefined, "12345"), undefined);
});

test("getUrl returns undefined for unknown entity type", () => {
  assert.strictEqual(dbxrefs.getURL("testdb", "unknown", "12345"), undefined);
});

test("getUrl returns undefined for entity type with no url syntax", () => {
  assert.strictEqual(
    dbxrefs.getURL("testdb", "no_url_syntax", "12345"),
    undefined,
  );
});

test("getDBXrefs returns the loaded dbxrefs", async () => {
  const dbxrefsData = dbxrefs.getDBXrefs();
  assert.strictEqual(Array.isArray(dbxrefsData), true);
  assert.strictEqual(dbxrefsData.length, 1);
});

test("init fails gracefully on network error", async () => {
  mock.method(global, "fetch", async () => {
    return new Response("Network Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  });

  await dbxrefs.init();
  assert.strictEqual(dbxrefs.hasError(), true);
  assert.strictEqual(dbxrefs.isReady(), true);
});
