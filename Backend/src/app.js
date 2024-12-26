import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import addressRouter from "./modules/address/address.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import google_router from "./modules/auth/auth.google.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
// import couponRouter from "./modules/coupon/coupon.routes.js";
import contactRouter from "./modules/contact/contact.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import userRouter from "./modules/user/user.routes.js";
import wishListRouter from "./modules/wishlist/wishlist.routes.js";
import { AppError } from "./utils/AppError.js";

import dotenv from "dotenv";
dotenv.config();



export function main(app) {
  
  app.use("/api/v1/products", productRouter);//seen
  app.use("/api/v1/users", userRouter); //done testing
  app.use("/api/v1/auth", authRouter); //done testing
  app.use("/api/v1/auth/google", google_router); //done testing
  app.use("/api/v1/review", reviewRouter);//seen
  app.use("/api/v1/wishlist", wishListRouter);//done testing
  app.use("/api/v1/address", addressRouter); //done testing
  // app.use("/api/v1/coupons", couponRouter);//seen
  app.use("/api/v1/carts", cartRouter);//seen
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/contacts", contactRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint was not found", 404));
  });

  app.use(globalErrorHandling);
}
