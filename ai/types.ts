// ai/types.ts
export type AdminArgs = {
  target: "PRODUCTS" | "TOP_SELLING" | "USERS" | "ORDERS";
  status?: "ANY" | "FILLED" | "UNFILLED";
  limit?: number;
};

export type AdminCtx = { userId: number; isAdmin: boolean };
