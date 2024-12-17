import express from "express";
import * as User from "./user.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addUserValidation,
  changeUserPasswordValidation,
  deleteUserValidation,
  updateUserValidation,
} from "./user.validation.js";
import rateLimit from "express-rate-limit";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});


const userRouter = express.Router();
userRouter.use(limiter);

userRouter
  .route("/")
  .post(validate(addUserValidation), User.addUser)
  .get(User.getAllUsers);

userRouter
  .route("/:id")
  .put(validate(updateUserValidation), User.updateUser)
  .delete(validate(deleteUserValidation), User.deleteUser)
  .patch(validate(changeUserPasswordValidation), User.changeUserPassword);

export default userRouter;
