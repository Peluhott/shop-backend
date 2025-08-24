

export const tools = [
  {type: "function",
    name: "get_orders",
    description: "Retrieve orders, optionally filtered by status.",
    parameters: {
      type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["all", "filled", "unfilled"],
        description: "filter orders by status. Defaults to 'all'."
      }
    },
    additionalProperties: false
  }
  }, 
  {
    type: "function",
    name: "get_products",
    description: "retrieves products",
    parameters: {
      type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["top", "all"],
        description: "have a choice of whether to get top selling products or all products, Defaults to all"
      }
    },
    additionalProperties: false
  }
},
{
    type: "function",
    name: "get_users",
    description: "gets list of users",
    parameters: {
      type: "object",
      additionalProperties: false
    }
    

  }
]