// ai/tools.ts
import type { ChatCompletionTool } from "openai/resources/chat/completions";

export const toolsCC: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "admin_query",
      description: "Read-only admin queries over products, users, and orders.",
      parameters: {
        type: "object",
        properties: {
          target: {
            type: "string",
            enum: ["PRODUCTS", "TOP_SELLING", "USERS", "ORDERS"],
            description: "Which dataset to fetch."
          },
          status: {
            type: "string",
            enum: ["ANY", "FILLED", "UNFILLED"],
            description: "Order filter; only applies to ORDERS."
          },
          limit: {
            type: "number",
            minimum: 1,
            maximum: 200,
            description: "Max rows to return (default 50)."
          }
        },
        required: ["target"]
      }
    }
  }
];
