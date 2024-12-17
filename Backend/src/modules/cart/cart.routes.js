import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as cart from "../cart/cart.controller.js"
const cartRouter = express.Router();
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

cartRouter.use(limiter);
cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), cart.addProductToCart)
  .get(protectedRoutes, allowedTo("user"), cart.getLoggedUserCart);

// cartRouter
//   .route("/apply-coupon")
//   .post(protectedRoutes, allowedTo("user"), cart.applyCoupon);

cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user"), cart.removeProductFromCart)
  .put(protectedRoutes, allowedTo("user"), cart.updateProductQuantity);

export default cartRouter;
