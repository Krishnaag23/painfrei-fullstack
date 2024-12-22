import express from "express";
import * as review from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";
import rateLimit from "express-rate-limit";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addReviewValidation,
  deleteReviewValidation,
  getSpecificReviewValidation,
  updateReviewValidation,
  getReviewsByProductIdValidation
} from "./review.validation.js";


const reviewRouter = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

reviewRouter.use(limiter);

reviewRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user"),
    validate(addReviewValidation),
    review.addReview
  )
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("user"),
    validate(updateReviewValidation),
    review.updateReview
  )
  .get(validate(getSpecificReviewValidation), review.getSpecificReview)
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    validate(deleteReviewValidation),
    review.deleteReview
  );
  reviewRouter.route("/product/:productId").get(validate(getReviewsByProductIdValidation), review.getReviewsByProductId);

export default reviewRouter;
