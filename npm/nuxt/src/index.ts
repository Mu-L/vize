/**
 * @vizejs/nuxt - Nuxt module for Vize
 *
 * Provides:
 * - Compiler: Vue SFC compilation via Vite plugin
 * - Musea: Component gallery with Nuxt mock support
 * - Linter: `vize lint` CLI command (via `vize` bin)
 * - Type Checker: `vize check` CLI command (via `vize` bin)
 */

import { defineNuxtModule } from "@nuxt/kit";
import vize from "@vizejs/vite-plugin";
import { musea } from "@vizejs/vite-plugin-musea";
import { nuxtMusea } from "@vizejs/musea-nuxt";
import type { MuseaOptions } from "@vizejs/vite-plugin-musea";
import type { NuxtMuseaOptions } from "@vizejs/musea-nuxt";

export interface VizeNuxtOptions {
  /**
   * Musea gallery options.
   * Set to `false` to disable musea.
   */
  musea?: MuseaOptions | false;

  /**
   * Nuxt mock options for musea gallery.
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
    nuxt.options.vite.plugins.push(vize());

    // Musea gallery
    if (options.musea !== false) {
      nuxt.options.vite.plugins.push(...musea(options.musea || {}));
      nuxt.options.vite.plugins.push(nuxtMusea(options.nuxtMusea || {}));
    }
  },
});

// Re-export types for convenience
export type { MuseaOptions } from "@vizejs/vite-plugin-musea";
export type { NuxtMuseaOptions } from "@vizejs/musea-nuxt";
