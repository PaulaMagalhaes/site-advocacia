#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

worker="${SITES_PROJECT_ROOT}/dist/server/index.js"
hosting="${SITES_PROJECT_ROOT}/dist/.openai/hosting.json"

[[ -f "${worker}" ]] || {
  echo "Missing Sites Worker entry: dist/server/index.js" >&2
  exit 66
}
[[ -f "${hosting}" ]] || {
  echo "Missing packaged Sites manifest: dist/.openai/hosting.json" >&2
  exit 66
}

node --input-type=module - "${worker}" "${hosting}" <<'NODE'
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const [workerPath, hostingPath] = process.argv.slice(2);
JSON.parse(await readFile(hostingPath, "utf8"));

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);
try {
  const worker = await import(workerUrl.href);
  if (!worker.default || typeof worker.default.fetch !== "function") {
    throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
  }
} catch (error) {
  // D1-enabled Vinext bundles intentionally retain the Cloudflare Workers
  // runtime import, which Node cannot resolve during this local verification.
  if (error?.code !== "ERR_UNSUPPORTED_ESM_URL_SCHEME") throw error;
  const source = await readFile(workerPath, "utf8");
  const hasWorkerFetch = /default\s*=\s*\{\s*async\s+fetch\s*\(/s.test(source);
  const hasDefaultExport = /export\s*\{[^}]*\bas\s+default\b[^}]*\}/s.test(source);
  if (!hasWorkerFetch || !hasDefaultExport) {
    throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
  }
}
NODE

echo "Validated Sites artifact: ESM Worker default.fetch and hosting manifest are present."
