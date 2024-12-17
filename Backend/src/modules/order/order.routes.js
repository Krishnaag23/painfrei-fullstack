import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as order from "../order/order.controller.js";
import rateLimit from "express-rate-limiter";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});


const orderRouter = express.Router();
orderRouter.use(limiter);

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
