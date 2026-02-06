/**
 * Musea MCP Server - AI-accessible component gallery.
 *
 * This MCP server exposes tools and resources for AI assistants to:
 * - List and search components in the gallery
 * - Get component metadata and variants
 * - Generate Storybook CSF from Art files
 * - Access design tokens
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// Native binding interface
interface NativeBinding {
  parseArt: (
    source: string,
    options?: { filename?: string },
  ) => {
    filename: string;
    metadata: {
      title: string;
      description?: string;
      component?: string;
      category?: string;
      tags: string[];
      status: string;
      order?: number;
    };
    variants: Array<{
      name: string;
      template: string;
      is_default: boolean;
      skip_vrt: boolean;
    }>;
    has_script_setup: boolean;
    has_script: boolean;
    style_count: number;
  };
  artToCsf: (
    source: string,
    options?: { filename?: string },
  ) => {
    code: string;
    filename: string;
  };
  generateArtPalette?: (
    source: string,
    artOptions?: { filename?: string },
    paletteOptions?: { infer_options?: boolean; group_by_type?: boolean },
  ) => {
    title: string;
    controls: Array<{
      name: string;
      control: string;
      default_value?: unknown;
      description?: string;
      required: boolean;
      options: Array<{ label: string; value: unknown }>;
      range?: { min: number; max: number; step?: number };
      group?: string;
    }>;
    groups: string[];
    json: string;
    typescript: string;
  };
  generateArtDoc?: (
    source: string,
    artOptions?: { filename?: string },
    docOptions?: {
      include_source?: boolean;
      include_templates?: boolean;
      include_metadata?: boolean;
    },
  ) => {
    markdown: string;
    filename: string;
    title: string;
    category?: string;
    variant_count: number;
  };
  generateArtCatalog?: (
    sources: string[],
    docOptions?: {
      include_source?: boolean;
      include_templates?: boolean;
      include_metadata?: boolean;
    },
  ) => {
    markdown: string;
    filename: string;
    component_count: number;
    categories: string[];
    tags: string[];
  };
  analyzeSfc?: (
    source: string,
    options?: { filename?: string },
  ) => {
    props: Array<{
      name: string;
      type: string;
      required: boolean;
      default_value?: unknown;
    }>;
    emits: string[];
  };
  generateVariants?: (
    componentPath: string,
    props: Array<{
      name: string;
      prop_type: string;
      required: boolean;
      default_value?: unknown;
    }>,
    config?: {
      max_variants?: number;
      include_default?: boolean;
      include_boolean_toggles?: boolean;
      include_enum_variants?: boolean;
      include_boundary_values?: boolean;
      include_empty_strings?: boolean;
    },
  ) => {
    variants: Array<{
      name: string;
      is_default: boolean;
      props: Record<string, unknown>;
      description?: string;
    }>;
    art_file_content: string;
    component_name: string;
  };
}

// Load native binding lazily
let native: NativeBinding | null = null;

function loadNative(): NativeBinding {
  if (native) return native;

  const require = createRequire(import.meta.url);
  try {
    native = require("@vizejs/native") as NativeBinding;
    return native;
  } catch (e) {
    throw new Error(`Failed to load @vizejs/native. Make sure it's installed: ${String(e)}`);
  }
}

// Art file info
interface ArtInfo {
  path: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  variantCount: number;
}

/**
 * Create and configure the MCP server.
 */
export function createMuseaServer(config: {
  projectRoot: string;
  include?: string[];
  exclude?: string[];
  tokensPath?: string;
}): Server {
  const server = new Server(
    {
      name: "musea-mcp-server",
      version: "0.0.1-alpha.11",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );

  const projectRoot = config.projectRoot;
  const include = config.include ?? ["**/*.art.vue"];
  const exclude = config.exclude ?? ["node_modules/**", "dist/**"];
  const tokensPath = config.tokensPath;

  // Cache for art files
  let artCache: Map<string, ArtInfo> = new Map();
  let lastScanTime = 0;

  // Scan for art files
  async function scanArtFiles(): Promise<Map<string, ArtInfo>> {
    const now = Date.now();
    if (now - lastScanTime < 5000 && artCache.size > 0) {
      return artCache;
    }

    const binding = loadNative();
    const files = await findArtFiles(projectRoot, include, exclude);

    artCache = new Map();

    for (const file of files) {
      try {
        const source = await fs.promises.readFile(file, "utf-8");
        const parsed = binding.parseArt(source, { filename: file });

        artCache.set(file, {
          path: file,
          title: parsed.metadata.title,
          description: parsed.metadata.description,
          category: parsed.metadata.category,
          tags: parsed.metadata.tags,
          variantCount: parsed.variants.length,
        });
      } catch (e) {
        console.error(`Failed to parse ${file}:`, e);
      }
    }

    lastScanTime = now;
    return artCache;
  }

  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const arts = await scanArtFiles();
    const resources = [];

    for (const [filePath, info] of arts) {
      const relativePath = path.relative(projectRoot, filePath);
      resources.push({
        uri: `musea://art/${encodeURIComponent(relativePath)}`,
        name: info.title,
        description:
          info.description || `${info.category || "Component"} with ${info.variantCount} variants`,
        mimeType: "application/json",
      });

      // Doc resource for each art file
      resources.push({
        uri: `musea://docs/${encodeURIComponent(relativePath)}`,
        name: `${info.title} (Docs)`,
        description: `Documentation for ${info.title}`,
        mimeType: "text/markdown",
      });
    }

    // Tokens resource
    const resolvedTokensPath = await resolveTokensPath();
    if (resolvedTokensPath) {
      resources.push({
        uri: "musea://tokens",
        name: "Design Tokens",
        description: "Design tokens for the project",
        mimeType: "application/json",
      });
    }

    return { resources };
  });

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri.startsWith("musea://art/")) {
      const relativePath = decodeURIComponent(uri.slice("musea://art/".length));
      const absolutePath = path.resolve(projectRoot, relativePath);

      try {
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const binding = loadNative();
        const parsed = binding.parseArt(source, { filename: absolutePath });

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(
                {
                  path: relativePath,
                  metadata: parsed.metadata,
                  variants: parsed.variants.map((v) => ({
                    name: v.name,
                    template: v.template,
                    isDefault: v.is_default,
                    skipVrt: v.skip_vrt,
                  })),
                  hasScriptSetup: parsed.has_script_setup,
                  hasScript: parsed.has_script,
                  styleCount: parsed.style_count,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (e) {
        throw new McpError(ErrorCode.InternalError, `Failed to read art file: ${String(e)}`);
      }
    }

    if (uri.startsWith("musea://docs/")) {
      const relativePath = decodeURIComponent(uri.slice("musea://docs/".length));
      const absolutePath = path.resolve(projectRoot, relativePath);

      try {
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const binding = loadNative();

        if (!binding.generateArtDoc) {
          throw new McpError(ErrorCode.InternalError, "generateArtDoc not available in native binding");
        }

        const doc = binding.generateArtDoc(source, { filename: absolutePath });

        return {
          contents: [
            {
              uri,
              mimeType: "text/markdown",
              text: doc.markdown,
            },
          ],
        };
      } catch (e) {
        if (e instanceof McpError) throw e;
        throw new McpError(ErrorCode.InternalError, `Failed to generate docs: ${String(e)}`);
      }
    }

    if (uri === "musea://tokens") {
      const resolvedTokensPath = await resolveTokensPath();
      if (!resolvedTokensPath) {
        throw new McpError(ErrorCode.InternalError, "No tokens path configured or auto-detected");
      }

      try {
        const categories = await parseTokensFromPath(resolvedTokensPath);
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify({ categories }, null, 2),
            },
          ],
        };
      } catch (e) {
        throw new McpError(ErrorCode.InternalError, `Failed to read tokens: ${String(e)}`);
      }
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_components",
          description: "List all components (Art files) in the project with their metadata",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Filter by category",
              },
              tag: {
                type: "string",
                description: "Filter by tag",
              },
            },
          },
        },
        {
          name: "get_component",
          description: "Get detailed information about a specific component",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file (relative to project root)",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "get_variant",
          description: "Get a specific variant from a component",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file",
              },
              variant: {
                type: "string",
                description: "Name of the variant",
              },
            },
            required: ["path", "variant"],
          },
        },
        {
          name: "generate_csf",
          description: "Generate Storybook CSF 3.0 code from an Art file",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "search_components",
          description: "Search components by title, description, or tags",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_palette",
          description:
            "Get props control palette for an Art file. Returns prop controls with types, defaults, and options for interactive editing.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file (relative to project root)",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "get_docs",
          description:
            "Generate Markdown documentation for a component Art file. Returns structured docs with metadata, variants, and optional source code.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file (relative to project root)",
              },
              includeSource: {
                type: "boolean",
                description: "Include source code in documentation (default: false)",
              },
              includeTemplates: {
                type: "boolean",
                description: "Include variant templates in documentation (default: false)",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "analyze_component",
          description:
            "Analyze a Vue SFC component to extract props and emits definitions. Resolves the component path from the Art file metadata.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the Art file (relative to project root)",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "generate_art",
          description:
            "Auto-generate an .art.vue file with variants from a Vue component. Analyzes props and creates appropriate variant combinations.",
          inputSchema: {
            type: "object",
            properties: {
              componentPath: {
                type: "string",
                description: "Path to the Vue component file (relative to project root)",
              },
              maxVariants: {
                type: "number",
                description: "Maximum number of variants to generate (default: 20)",
              },
              includeDefault: {
                type: "boolean",
                description: "Include a default variant (default: true)",
              },
              includeBooleanToggles: {
                type: "boolean",
                description: "Include boolean toggle variants (default: true)",
              },
              includeEnumVariants: {
                type: "boolean",
                description: "Include enum/union type variants (default: true)",
              },
            },
            required: ["componentPath"],
          },
        },
        {
          name: "get_tokens",
          description:
            "Get design tokens from a Style Dictionary tokens file or directory. Returns parsed token categories.",
          inputSchema: {
            type: "object",
            properties: {
              tokensPath: {
                type: "string",
                description:
                  "Path to tokens JSON file or directory (relative to project root). If not provided, auto-detects from project.",
              },
              format: {
                type: "string",
                enum: ["json", "markdown"],
                description: "Output format (default: json)",
              },
            },
          },
        },
        {
          name: "generate_catalog",
          description:
            "Generate a full catalog document for all Art files in the project. Returns a Markdown document listing all components with metadata.",
          inputSchema: {
            type: "object",
            properties: {
              includeSource: {
                type: "boolean",
                description: "Include source code in catalog (default: false)",
              },
              includeTemplates: {
                type: "boolean",
                description: "Include variant templates in catalog (default: false)",
              },
            },
          },
        },
      ],
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const binding = loadNative();

    switch (name) {
      case "list_components": {
        const arts = await scanArtFiles();
        let results = Array.from(arts.values());

        if (args?.category) {
          results = results.filter(
            (a) => a.category?.toLowerCase() === (args.category as string).toLowerCase(),
          );
        }

        if (args?.tag) {
          results = results.filter((a) =>
            a.tags.some((t) => t.toLowerCase() === (args.tag as string).toLowerCase()),
          );
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                results.map((r) => ({
                  path: path.relative(projectRoot, r.path),
                  title: r.title,
                  description: r.description,
                  category: r.category,
                  tags: r.tags,
                  variantCount: r.variantCount,
                })),
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_component": {
        const artPath = args?.path as string;
        if (!artPath) {
          throw new McpError(ErrorCode.InvalidParams, "path is required");
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const parsed = binding.parseArt(source, { filename: absolutePath });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  metadata: parsed.metadata,
                  variants: parsed.variants.map((v) => ({
                    name: v.name,
                    template: v.template,
                    isDefault: v.is_default,
                    skipVrt: v.skip_vrt,
                  })),
                  hasScriptSetup: parsed.has_script_setup,
                  hasScript: parsed.has_script,
                  styleCount: parsed.style_count,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_variant": {
        const artPath = args?.path as string;
        const variantName = args?.variant as string;

        if (!artPath || !variantName) {
          throw new McpError(ErrorCode.InvalidParams, "path and variant are required");
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const parsed = binding.parseArt(source, { filename: absolutePath });

        const variant = parsed.variants.find(
          (v) => v.name.toLowerCase() === variantName.toLowerCase(),
        );

        if (!variant) {
          throw new McpError(ErrorCode.InvalidParams, `Variant "${variantName}" not found`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  name: variant.name,
                  template: variant.template,
                  isDefault: variant.is_default,
                  skipVrt: variant.skip_vrt,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "generate_csf": {
        const artPath = args?.path as string;
        if (!artPath) {
          throw new McpError(ErrorCode.InvalidParams, "path is required");
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const csf = binding.artToCsf(source, { filename: absolutePath });

        return {
          content: [
            {
              type: "text",
              text: csf.code,
            },
          ],
        };
      }

      case "search_components": {
        const query = (args?.query as string)?.toLowerCase();
        if (!query) {
          throw new McpError(ErrorCode.InvalidParams, "query is required");
        }

        const arts = await scanArtFiles();
        const results = Array.from(arts.values()).filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            a.description?.toLowerCase().includes(query) ||
            a.tags.some((t) => t.toLowerCase().includes(query)),
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                results.map((r) => ({
                  path: path.relative(projectRoot, r.path),
                  title: r.title,
                  description: r.description,
                  category: r.category,
                  tags: r.tags,
                })),
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_palette": {
        const artPath = args?.path as string;
        if (!artPath) {
          throw new McpError(ErrorCode.InvalidParams, "path is required");
        }

        if (!binding.generateArtPalette) {
          throw new McpError(
            ErrorCode.InternalError,
            "generateArtPalette not available in native binding",
          );
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const palette = binding.generateArtPalette(source, { filename: absolutePath });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  title: palette.title,
                  controls: palette.controls.map((c) => ({
                    name: c.name,
                    control: c.control,
                    defaultValue: c.default_value,
                    description: c.description,
                    required: c.required,
                    options: c.options,
                    range: c.range,
                    group: c.group,
                  })),
                  groups: palette.groups,
                  json: palette.json,
                  typescript: palette.typescript,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_docs": {
        const artPath = args?.path as string;
        if (!artPath) {
          throw new McpError(ErrorCode.InvalidParams, "path is required");
        }

        if (!binding.generateArtDoc) {
          throw new McpError(
            ErrorCode.InternalError,
            "generateArtDoc not available in native binding",
          );
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");
        const doc = binding.generateArtDoc(source, { filename: absolutePath }, {
          include_source: args?.includeSource as boolean | undefined,
          include_templates: args?.includeTemplates as boolean | undefined,
          include_metadata: true,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  markdown: doc.markdown,
                  title: doc.title,
                  category: doc.category,
                  variantCount: doc.variant_count,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "analyze_component": {
        const artPath = args?.path as string;
        if (!artPath) {
          throw new McpError(ErrorCode.InvalidParams, "path is required");
        }

        const absolutePath = path.resolve(projectRoot, artPath);
        const artSource = await fs.promises.readFile(absolutePath, "utf-8");
        const parsed = binding.parseArt(artSource, { filename: absolutePath });

        if (!parsed.metadata.component) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Art file does not reference a component (no component metadata)",
          );
        }

        // Resolve component path relative to the art file's directory
        const artDir = path.dirname(absolutePath);
        const componentPath = path.resolve(artDir, parsed.metadata.component);

        if (!binding.analyzeSfc) {
          throw new McpError(
            ErrorCode.InternalError,
            "analyzeSfc not available in native binding",
          );
        }

        const componentSource = await fs.promises.readFile(componentPath, "utf-8");
        const analysis = binding.analyzeSfc(componentSource, { filename: componentPath });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  props: analysis.props.map((p) => ({
                    name: p.name,
                    type: p.type,
                    required: p.required,
                    defaultValue: p.default_value,
                  })),
                  emits: analysis.emits,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "generate_art": {
        const componentRelPath = args?.componentPath as string;
        if (!componentRelPath) {
          throw new McpError(ErrorCode.InvalidParams, "componentPath is required");
        }

        const absolutePath = path.resolve(projectRoot, componentRelPath);
        const source = await fs.promises.readFile(absolutePath, "utf-8");

        // Extract props
        let props: Array<{
          name: string;
          prop_type: string;
          required: boolean;
          default_value?: unknown;
        }>;

        if (binding.analyzeSfc) {
          const analysis = binding.analyzeSfc(source, { filename: absolutePath });
          props = analysis.props.map((p) => ({
            name: p.name,
            prop_type: p.type,
            required: p.required,
            default_value: p.default_value,
          }));
        } else {
          // Fallback: simple regex-based prop extraction
          props = extractPropsSimple(source);
        }

        if (!binding.generateVariants) {
          throw new McpError(
            ErrorCode.InternalError,
            "generateVariants not available in native binding",
          );
        }

        const relPath = `./${path.basename(absolutePath)}`;
        const result = binding.generateVariants(relPath, props, {
          max_variants: args?.maxVariants as number | undefined,
          include_default: args?.includeDefault as boolean | undefined,
          include_boolean_toggles: args?.includeBooleanToggles as boolean | undefined,
          include_enum_variants: args?.includeEnumVariants as boolean | undefined,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  componentName: result.component_name,
                  artFileContent: result.art_file_content,
                  variants: result.variants.map((v) => ({
                    name: v.name,
                    isDefault: v.is_default,
                    props: v.props,
                    description: v.description,
                  })),
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_tokens": {
        const inputPath = args?.tokensPath as string | undefined;
        const format = (args?.format as string) ?? "json";

        let resolvedPath: string | null;
        if (inputPath) {
          resolvedPath = path.resolve(projectRoot, inputPath);
        } else {
          resolvedPath = await resolveTokensPath();
        }

        if (!resolvedPath) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "No tokens path provided and none auto-detected. Looked for: tokens/, design-tokens/, style-dictionary/ directories.",
          );
        }

        const categories = await parseTokensFromPath(resolvedPath);

        if (format === "markdown") {
          const markdown = generateTokensMarkdownInline(categories);
          return {
            content: [{ type: "text", text: markdown }],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ categories }, null, 2),
            },
          ],
        };
      }

      case "generate_catalog": {
        if (!binding.generateArtCatalog) {
          throw new McpError(
            ErrorCode.InternalError,
            "generateArtCatalog not available in native binding",
          );
        }

        const arts = await scanArtFiles();
        const sources: string[] = [];

        for (const [filePath] of arts) {
          const source = await fs.promises.readFile(filePath, "utf-8");
          sources.push(source);
        }

        const catalog = binding.generateArtCatalog(sources, {
          include_source: args?.includeSource as boolean | undefined,
          include_templates: args?.includeTemplates as boolean | undefined,
          include_metadata: true,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  markdown: catalog.markdown,
                  componentCount: catalog.component_count,
                  categories: catalog.categories,
                  tags: catalog.tags,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  });

  // Resolve tokens path: explicit config > auto-detect common directories
  async function resolveTokensPath(): Promise<string | null> {
    if (tokensPath) {
      return path.resolve(projectRoot, tokensPath);
    }

    const candidates = ["tokens", "design-tokens", "style-dictionary"];
    for (const dir of candidates) {
      const candidate = path.join(projectRoot, dir);
      try {
        const stat = await fs.promises.stat(candidate);
        if (stat.isDirectory() || stat.isFile()) return candidate;
      } catch {
        // not found
      }
    }
    return null;
  }

  return server;
}

// Token parsing helpers (lightweight inline implementation to avoid external deps)

interface TokenValue {
  value: string | number;
  type?: string;
  description?: string;
}

interface TokenCategory {
  name: string;
  tokens: Record<string, TokenValue>;
  subcategories?: TokenCategory[];
}

async function parseTokensFromPath(tokensPath: string): Promise<TokenCategory[]> {
  const stat = await fs.promises.stat(tokensPath);

  if (stat.isDirectory()) {
    const entries = await fs.promises.readdir(tokensPath, { withFileTypes: true });
    const categories: TokenCategory[] = [];

    for (const entry of entries) {
      if (entry.isFile() && (entry.name.endsWith(".json") || entry.name.endsWith(".tokens.json"))) {
        const filePath = path.join(tokensPath, entry.name);
        const content = await fs.promises.readFile(filePath, "utf-8");
        const tokens = JSON.parse(content);
        const categoryName = path
          .basename(entry.name, path.extname(entry.name))
          .replace(".tokens", "");

        categories.push({
          name: formatCategoryName(categoryName),
          tokens: extractTokenValues(tokens),
          subcategories: extractSubcats(tokens),
        });
      }
    }

    return categories;
  }

  const content = await fs.promises.readFile(tokensPath, "utf-8");
  const tokens = JSON.parse(content);
  return flattenTokenStructure(tokens);
}

function isTokenLeaf(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return "value" in obj && (typeof obj.value === "string" || typeof obj.value === "number");
}

function extractTokenValues(obj: Record<string, unknown>): Record<string, TokenValue> {
  const tokens: Record<string, TokenValue> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isTokenLeaf(value)) {
      const raw = value as Record<string, unknown>;
      tokens[key] = {
        value: raw.value as string | number,
        type: raw.type as string | undefined,
        description: raw.description as string | undefined,
      };
    }
  }
  return tokens;
}

function extractSubcats(obj: Record<string, unknown>): TokenCategory[] | undefined {
  const subcategories: TokenCategory[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (!isTokenLeaf(value) && typeof value === "object" && value !== null) {
      const tokens = extractTokenValues(value as Record<string, unknown>);
      const nested = extractSubcats(value as Record<string, unknown>);
      if (Object.keys(tokens).length > 0 || (nested && nested.length > 0)) {
        subcategories.push({
          name: formatCategoryName(key),
          tokens,
          subcategories: nested,
        });
      }
    }
  }
  return subcategories.length > 0 ? subcategories : undefined;
}

function flattenTokenStructure(tokens: Record<string, unknown>): TokenCategory[] {
  const categories: TokenCategory[] = [];
  for (const [key, value] of Object.entries(tokens)) {
    if (isTokenLeaf(value)) continue;
    if (typeof value === "object" && value !== null) {
      const categoryTokens = extractTokenValues(value as Record<string, unknown>);
      const subcategories = flattenTokenStructure(value as Record<string, unknown>);
      if (Object.keys(categoryTokens).length > 0 || subcategories.length > 0) {
        categories.push({
          name: formatCategoryName(key),
          tokens: categoryTokens,
          subcategories: subcategories.length > 0 ? subcategories : undefined,
        });
      }
    }
  }
  return categories;
}

function formatCategoryName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generateTokensMarkdownInline(categories: TokenCategory[]): string {
  const renderCategory = (category: TokenCategory, level: number = 2): string => {
    const heading = "#".repeat(level);
    let md = `\n${heading} ${category.name}\n\n`;

    if (Object.keys(category.tokens).length > 0) {
      md += "| Token | Value | Description |\n";
      md += "|-------|-------|-------------|\n";
      for (const [name, token] of Object.entries(category.tokens)) {
        md += `| \`${name}\` | \`${token.value}\` | ${token.description || "-"} |\n`;
      }
      md += "\n";
    }

    if (category.subcategories) {
      for (const sub of category.subcategories) {
        md += renderCategory(sub, level + 1);
      }
    }

    return md;
  };

  let markdown = "# Design Tokens\n";
  for (const category of categories) {
    markdown += renderCategory(category);
  }
  return markdown;
}

// Simple prop extraction fallback (when native analyzeSfc not available)
function extractPropsSimple(
  source: string,
): Array<{ name: string; prop_type: string; required: boolean; default_value?: unknown }> {
  const props: Array<{ name: string; prop_type: string; required: boolean; default_value?: unknown }> = [];
  const propsMatch = source.match(/defineProps\s*<\s*\{([^}]*)\}\s*>/s);
  if (propsMatch) {
    const propsBlock = propsMatch[1];
    for (const line of propsBlock.split("\n")) {
      const propMatch = line.trim().match(/^(\w+)(\?)?:\s*(.+?)\s*;?\s*$/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          prop_type: propMatch[3].replace(/,\s*$/, ""),
          required: !propMatch[2],
        });
      }
    }
  }
  return props;
}

// Utility functions

async function findArtFiles(root: string, include: string[], exclude: string[]): Promise<string[]> {
  const files: string[] = [];

  async function scan(dir: string): Promise<void> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relative = path.relative(root, fullPath);

      // Check exclude
      let excluded = false;
      for (const pattern of exclude) {
        if (matchGlob(relative, pattern) || matchGlob(entry.name, pattern)) {
          excluded = true;
          break;
        }
      }

      if (excluded) continue;

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".art.vue")) {
        for (const pattern of include) {
          if (matchGlob(relative, pattern)) {
            files.push(fullPath);
            break;
          }
        }
      }
    }
  }

  await scan(root);
  return files;
}

function matchGlob(filepath: string, pattern: string): boolean {
  const regex = pattern
    .replace(/\*\*/g, "{{DOUBLE_STAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{DOUBLE_STAR}}/g, ".*")
    .replace(/\./g, "\\.");

  return new RegExp(`^${regex}$`).test(filepath);
}

/**
 * Start the MCP server with stdio transport.
 */
export async function startServer(
  projectRoot: string,
  options?: { tokensPath?: string },
): Promise<void> {
  const server = createMuseaServer({ projectRoot, tokensPath: options?.tokensPath });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("[musea-mcp] Server started");
}

export default createMuseaServer;
