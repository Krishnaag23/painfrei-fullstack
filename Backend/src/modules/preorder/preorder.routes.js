// preorder.routes.js
import express from "express";
import * as PreOrder from "../preorder/preorder.controller.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const preOrderRouter = express.Router();
preOrderRouter.use(limiter);

// Public routes (no authentication required)
preOrderRouter.route("/create-payment").post(PreOrder.createPreOrderPayment);

preOrderRouter.route("/verify-payment").post(PreOrder.verifyPreOrderPayment);
// Existing route
preOrderRouter.route("/:id").post(PreOrder.createNewPreOrder);

export default preOrderRouter;
