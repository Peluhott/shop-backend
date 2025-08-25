import OpenAI from "openai";
const openai = new OpenAI();

// derive the create() arg type
type CreateArgs = Parameters<typeof openai.responses.create>[0];
// a single function tool item
type FunctionToolItem = Extract<
  NonNullable<CreateArgs["tools"]>[number],
  { type: "function" }
>;

const getOrdersTool = {
  type: "function" as const,
  strict: true as const,
  name: "get_orders",
  description: "Retrieve orders, optionally filtered by status.",
  parameters: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["all", "filled", "unfilled"],
        description: "Filter orders by status. Default 'all' if omitted."
      }
    },
    additionalProperties: false,
    required: ["status"] // <-- add this (or ['status'] if you want it required)
  }
} satisfies FunctionToolItem;

const getProductsTool = {
  type: "function" as const,
  strict: true as const,
  name: "get_products",
  description: "Retrieve products, optionally filtered to top sellers.",
  parameters: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["all", "top"],
        description: "Use 'top' for top sellers; otherwise 'all'."
      }
    },
    additionalProperties: false,
    required: ["status"] // <-- add this
  }
} satisfies FunctionToolItem;

const getUsersTool = {
  type: "function" as const,
  strict: true as const,
  name: "get_users",
  description: "Get a list of users.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
    required: []
  }
} satisfies FunctionToolItem;

// IMPORTANT: no `as const` on the ARRAY, keep it mutable
export const toolsToUse: FunctionToolItem[] = [
  getOrdersTool,
  getProductsTool,
  getUsersTool
];
