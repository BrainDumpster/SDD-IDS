import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { availability, resolveNames } from "../features/availability/availability.js";
import { buildIdsTheme, patchProgrammeToken } from "../features/css-export/css-export.js";
import { createTheme, deleteTheme } from "../features/themes/themes.js";
import { createToken, deleteToken, getToken, updateToken } from "../features/tokens/tokens.js";

const server = new McpServer({ name: "design-token-manager", version: "1.0.0" });

function text(payload) {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

server.registerTool(
  "list_design_tokens",
  {
    description: "List design tokens available in the DTM catalog.",
    inputSchema: {
      theme: z.string().optional(),
      group: z.string().optional(),
      q: z.string().optional(),
    },
  },
  async (args) => text(availability(args)),
);

server.registerTool(
  "get_design_token",
  {
    description: "Get one design token by CSS name.",
    inputSchema: { name: z.string() },
  },
  async ({ name }) => {
    const token = getToken(name);
    return text(token ? { status: "available", token } : { status: "missing", name });
  },
);

server.registerTool(
  "resolve_design_tokens",
  {
    description: "Check token availability. Creates a common token only when createMissing is true and a draft with group and light value is supplied.",
    inputSchema: {
      names: z.array(z.string()),
      programme: z.string().optional(),
      theme: z.string().optional(),
      createMissing: z.boolean().optional(),
      drafts: z
        .array(
          z.object({
            name: z.string(),
            group: z.string(),
            alias: z.string().optional(),
            values: z.object({ light: z.string() }).passthrough(),
          }),
        )
        .optional(),
    },
  },
  async (args) => text({ results: resolveNames(args) }),
);

server.registerTool(
  "create_common_token",
  {
    description: "Create a common token. Returns the existing token when the name is already available.",
    inputSchema: {
      name: z.string(),
      group: z.string(),
      alias: z.string().optional(),
      values: z.object({ light: z.string() }).passthrough(),
    },
  },
  async (args) => text(createToken(args)),
);

server.registerTool(
  "update_common_token",
  {
    description: "Update a common token. Clearing a non-light theme value removes that theme key.",
    inputSchema: {
      name: z.string(),
      group: z.string().optional(),
      alias: z.string().optional(),
      values: z.record(z.string(), z.string()).optional(),
    },
  },
  async ({ name, ...draft }) => text(updateToken(name, draft)),
);

server.registerTool(
  "delete_common_token",
  {
    description: "Delete a common token that is not referenced by a design spec or programme theme.",
    inputSchema: { name: z.string() },
  },
  async ({ name }) => text(deleteToken(name)),
);

server.registerTool(
  "create_theme",
  {
    description: "Add an optional theme. Tokens without a value for it keep the light value.",
    inputSchema: { id: z.string(), label: z.string() },
  },
  async (args) => text(createTheme(args)),
);

server.registerTool(
  "delete_theme",
  {
    description: "Delete an optional theme. The light theme cannot be deleted.",
    inputSchema: { id: z.string() },
  },
  async ({ id }) => text(deleteTheme(id)),
);

server.registerTool(
  "set_programme_override",
  {
    description: "Patch one catalog token name inside a programme theme file. Does not rewrite the file.",
    inputSchema: {
      programme: z.enum(["synapse", "dap", "powerflex"]),
      name: z.string(),
      values: z.object({ light: z.string().optional(), dark: z.string().optional() }).passthrough(),
    },
  },
  async ({ programme, name, values }) => text(patchProgrammeToken(programme, name, values)),
);

server.registerTool(
  "rebuild_theme_css",
  {
    description: "Validate the catalog and rewrite components/ids-theme.css. Programme files are not regenerated.",
    inputSchema: {},
  },
  async () => text(buildIdsTheme({ write: true })),
);

const transport = new StdioServerTransport();
await server.connect(transport);
