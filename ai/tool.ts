
export const tools = [
  {
    type: "function",
    strict: true,
    function: {
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
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    strict: true,
    function: {
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
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    strict: true,
    function: {
      name: "get_users",
      description: "Get a list of users.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    }
  }
];
