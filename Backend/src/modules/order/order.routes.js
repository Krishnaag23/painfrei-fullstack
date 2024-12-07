import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as order from "../order/order.controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), order.createCashOrder);
orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), order.getSpecificOrder);
orderRouter.post(
  "/razorpay/:id",
  protectedRoutes,
  allowedTo("user"),
  order.createRazorpayOrder
);

orderRouter.post(
  "/verify-payment/:id",
  protectedRoutes,
  allowedTo("user"),
  order.verifyRazorpayPayment
);

orderRouter.get("/all", order.getAllOrders);
export default orderRouter;
