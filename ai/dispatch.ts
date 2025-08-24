// ai/dispatch.ts
import { AdminArgs, AdminCtx } from "./types";
import * as productRepo from "../Product/product.repository";
import * as orderService from "../Order/order.service";
import * as userRepo from "../User/user.repository";

const clamp = (n = 50, min = 1, max = 200) => Math.min(Math.max(n, min), max);

export async function dispatchAdminQuery(args: AdminArgs, ctx: AdminCtx) {
  if (!ctx.isAdmin) throw new Error("Forbidden: admin only");
  const limit = clamp(args.limit);

  switch (args.target) {
    case "PRODUCTS":
      return productRepo.getAllProducts();
    case "TOP_SELLING":
      return productRepo.getTopSellingProducts(limit);
    case "USERS":
      // implement this in your repo
      return userRepo.getAllUsers();
    case "ORDERS":
      if (args.status === "UNFILLED") return orderService.getUnfilledOrders();
      if (args.status === "FILLED") return orderService.getFilledOrders();
      return orderService.getAllOrders();
    default:
      return [];
  }
}
