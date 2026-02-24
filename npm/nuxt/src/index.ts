/**
 * @vizejs/nuxt - Nuxt module for Vize
 *
 * Provides:
 * - Compiler: Vue SFC compilation via Vite plugin
 * - Musea: Component gallery with Nuxt mock support
 * - Linter: `vize lint` CLI command (via `vize` bin)
 * - Type Checker: `vize check` CLI command (via `vize` bin)
 */

import { defineNuxtModule, addVitePlugin } from "@nuxt/kit";
import vize from "@vizejs/vite-plugin";
import { musea } from "@vizejs/vite-plugin-musea";
import type { MuseaOptions } from "@vizejs/vite-plugin-musea";
import type { NuxtMuseaOptions } from "@vizejs/musea-nuxt";

export interface VizeNuxtOptions {
  /**
   * Enable/disable the Vize compiler (Vue SFC compilation via Vite plugin).
   * Set to `false` to use Vue's default SFC compiler instead.
   * @default true
   */
  compiler?: boolean;

  /**
   * Musea gallery options.
   * Set to `false` to disable musea.
   */
  musea?: MuseaOptions | false;

  /**
   * Nuxt mock options for musea gallery.
   * NOTE: In Nuxt context, nuxtMusea mocks are NOT added as a global Vite plugin
   * because they would intercept `#imports` resolution and break Nuxt's internals.
   * Real Nuxt composables are available via Nuxt's own plugin pipeline.
   */
  nuxtMusea?: NuxtMuseaOptions;
}

export default defineNuxtModule<VizeNuxtOptions>({
  meta: {
    name: "@vizejs/nuxt",
    configKey: "vize",
  },
  defaults: {
    musea: {
      include: ["**/*.art.vue"],
      inlineArt: false,
    },
    nuxtMusea: {
      route: { path: "/" },
    },
  },
  setup(options, nuxt) {
    nuxt.options.vite.plugins = nuxt.options.vite.plugins || [];

    // Compiler
    if (options.compiler !== false) {
      nuxt.options.vite.plugins.push(vize());

      // Remove Nuxt's built-in @vitejs/plugin-vue when vize is active.
      // Both plugins handle .vue files; if both are active, @vitejs/plugin-vue
      // may try to read vize's \0-prefixed virtual module IDs via fs.readFileSync,
      // causing "path must not contain null bytes" / ENOENT errors.
      //
      // Nuxt adds @vitejs/plugin-vue AFTER vite:extendConfig but BEFORE
      // vite:configResolved. For the environment API path, the hook receives
      // a shallow copy of the config, so we must MUTATE the plugins array
      // in-place (splice) rather than replacing it (filter), so the change
      // propagates to the original config used by createServer().
      nuxt.hook("vite:configResolved", (config: { plugins: Array<{ name?: string }> }) => {
        for (let i = config.plugins.length - 1; i >= 0; i--) {
          const p = config.plugins[i];
          const name = p && typeof p === "object" && "name" in p ? p.name : "";
          if (name === "vite:vue") {
            config.plugins.splice(i, 1);
          }
        }
      });
    }

    // ─── Bridge: Apply Nuxt transforms to vize virtual modules ────────────
    // Nuxt's auto-import (unimport) and component loader (LoaderPlugin) use
    // unplugin-utils/createFilter which hard-excludes \0-prefixed module IDs.
    // Since vize uses \0-prefixed virtual IDs (Rollup convention), those
    // transforms never run on vize-compiled modules. This bridge plugin
    // fills the gap by applying the same transforms in a post-processing step.

    // Capture unimport context for composable auto-imports (useRoute, ref, computed, etc.)
    let unimportCtx: {
      injectImports: (code: string, id?: string) => Promise<{ code: string; s: unknown; imports: unknown[] }>;
    } | null = null;
    nuxt.hook("imports:context", (ctx: unknown) => {
      unimportCtx = ctx as typeof unimportCtx;
    });

    // Capture component registry for component auto-imports (NuxtPage, NuxtLayout, etc.)
    let nuxtComponents: Array<{
      pascalName: string;
      kebabName: string;
      name: string;
      filePath: string;
      export: string;
    }> = [];
    nuxt.hook("components:extend", (comps: unknown) => {
      nuxtComponents = comps as typeof nuxtComponents;
    });

    addVitePlugin({
      name: "vizejs:nuxt-transform-bridge",
      enforce: "post" as const,
      async transform(code: string, id: string) {
        // Only process vize virtual modules
        if (!id.startsWith("\0") || !id.endsWith(".vue.ts")) return;

        let result = code;
        let changed = false;

        // 1. Component auto-imports: replace _resolveComponent("Name") with direct imports
        // Nuxt's LoaderPlugin normally does this, but skips \0-prefixed IDs.
        if (nuxtComponents.length > 0) {
          const compImports: string[] = [];
          let counter = 0;
          result = result.replace(
            /_?resolveComponent\s*\(\s*["'`]([^"'`]+)["'`]\s*(?:,\s*[^)]+)?\)/g,
            (match: string, name: string) => {
              const comp = nuxtComponents.find(
                (c) => c.pascalName === name || c.kebabName === name || c.name === name,
              );
              if (comp) {
                const varName = `__nuxt_component_${counter++}`;
                const exportName = comp.export || "default";
                if (exportName === "default") {
                  compImports.push(`import ${varName} from ${JSON.stringify(comp.filePath)};`);
                } else {
                  compImports.push(
                    `import { ${exportName} as ${varName} } from ${JSON.stringify(comp.filePath)};`,
                  );
                }
                return varName;
              }
              return match;
            },
          );
          if (compImports.length > 0) {
            result = compImports.join("\n") + "\n" + result;
            changed = true;
          }
        }

        // 2. i18n function injection: inject useI18n() for $t, $rt, $d, $n, $tm, $te
        // @nuxtjs/i18n's TransformI18nFunctionPlugin skips \0-prefixed IDs.
        // Must inject inside the setup() function body, not at module top level.
        const i18nFnRe = /\$([tdn]|rt|tm|te)\s*\(/;
        if (i18nFnRe.test(result) && !result.includes("useI18n")) {
          const i18nMap: Record<string, string> = {
            $t: "t: $t", $rt: "rt: $rt", $d: "d: $d",
            $n: "n: $n", $tm: "tm: $tm", $te: "te: $te",
          };
          const usedFns: string[] = [];
          for (const [fn, destructure] of Object.entries(i18nMap)) {
            // Escape $ for regex
            if (new RegExp(`\\${fn}\\s*\\(`).test(result)) {
              usedFns.push(destructure);
            }
          }
          if (usedFns.length > 0) {
            // Find the setup function opening brace to inject inside it
            const setupMatch = result.match(/setup\s*\(__props[\s\S]*?\)\s*\{/);
            if (setupMatch && setupMatch.index !== undefined) {
              const insertPos = setupMatch.index + setupMatch[0].length;
              const injection = `\nconst { ${usedFns.join(", ")} } = useI18n();\n`;
              result = result.slice(0, insertPos) + injection + result.slice(insertPos);
              changed = true;
            }
          }
        }

        // 3. Composable auto-imports: inject useRoute, ref, computed, useI18n, etc.
        // Nuxt's unimport TransformPlugin normally does this, but skips \0-prefixed IDs.
        // Runs after i18n injection so unimport picks up the `useI18n` reference.
        if (unimportCtx) {
          try {
            const injected = await unimportCtx.injectImports(result, id);
            if (injected.imports && injected.imports.length > 0) {
              result = injected.code;
              changed = true;
            }
          } catch {
            // Ignore errors — auto-imports might not be needed for all modules
          }
        }

        if (changed) {
          return { code: result, map: null };
        }
      },
    });

    // ─── UnoCSS bridge: patch filter to accept vize virtual modules ────────
    // UnoCSS's Vite plugin uses createFilter from unplugin-utils which
    // hard-excludes \0-prefixed module IDs. Patch the transform functions
    // to strip the \0 prefix so UnoCSS can extract utility classes.
    addVitePlugin({
      name: "vizejs:unocss-bridge",
      configResolved(config: { plugins: Array<{ name: string; transform?: Function }> }) {
        for (const plugin of config.plugins) {
          if (plugin.name?.startsWith("unocss:") && typeof plugin.transform === "function") {
            const origTransform = plugin.transform;
            plugin.transform = function (code: string, id: string, ...args: unknown[]) {
              if (id.startsWith("\0") && id.endsWith(".vue.ts")) {
                // Strip \0 prefix so UnoCSS's filter doesn't reject it
                return origTransform.call(this, code, id.slice(1), ...args);
              }
              return origTransform.call(this, code, id, ...args);
            };
          }
        }
      },
    });

    // Musea gallery (without nuxtMusea mock layer)
    // In Nuxt context, real composables/components are already available
    // via Nuxt's own Vite plugins. Adding nuxtMusea globally would shadow
    // Nuxt's #imports resolution and break the app.
    if (options.musea !== false) {
      const museaBasePath = options.musea && typeof options.musea === "object" && "basePath" in options.musea
        ? (options.musea as Record<string, unknown>).basePath as string
        : "/__musea__";
      nuxt.options.vite.plugins.push(...musea(options.musea || {}));

      // Print Musea Gallery URL after dev server starts
      nuxt.hook("listen", (_server: unknown, listener: { url: string }) => {
        const url = listener.url?.replace(/\/$/, "") || "http://localhost:3000";
        console.log(`  \x1b[36m➜\x1b[0m  \x1b[1mMusea Gallery:\x1b[0m \x1b[36m${url}${museaBasePath}\x1b[0m`);
      });
    }
  },
});

// Re-export types for convenience
export type { MuseaOptions } from "@vizejs/vite-plugin-musea";
export type { NuxtMuseaOptions } from "@vizejs/musea-nuxt";
