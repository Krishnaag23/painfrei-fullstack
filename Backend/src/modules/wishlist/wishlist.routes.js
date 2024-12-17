import express from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addToWishListValidation,
  deleteFromWishListValidation,
} from "./wishlist.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as wishlist from "../wishlist/wishlist.controller.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});


const wishListRouter = express.Router();
wishListRouter.use(limiter);
wishListRouter
  .route("/")
  .patch(
    protectedRoutes,
    allowedTo("user"),
    validate(addToWishListValidation),
    wishlist.addToWishList
  )
  .delete(
    protectedRoutes,
    allowedTo("user"),
    validate(deleteFromWishListValidation),
    wishlist.removeFromWishList
  )
  .get(protectedRoutes, allowedTo("user"), wishlist.getAllUserWishList);

export default wishListRouter;
