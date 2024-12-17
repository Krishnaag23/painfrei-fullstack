import express from "express";
import { validate } from "../../middlewares/validate.js";
import rateLimit from "express-rate-limit";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as address from "../address/address.controller.js";
import {
  addAddressValidation,
  deleteAddressValidation,
} from "./address.validation.js";

const addressRouter = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

addressRouter.use(limiter);

addressRouter
  .route("/")
  .patch(
    limiter,
    protectedRoutes,
    allowedTo("user"),
    validate(addAddressValidation),
    address.addAddress
  )
  .delete(
    limiter,
    protectedRoutes,
    allowedTo("user"),
    validate(deleteAddressValidation),
    address.removeAddress
  )
  .get(limiter, protectedRoutes, allowedTo("user"), address.getAllAddresses);

export default addressRouter;
