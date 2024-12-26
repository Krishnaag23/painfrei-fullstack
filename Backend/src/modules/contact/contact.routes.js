import express from "express";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
import * as contact from "../contact/contact.controller.js";
import rateLimit from "express-rate-limit";
import { validate } from "../../middlewares/validate.js";
import {createContactValidation,
  getSpecificContactValidation,
  updateContactStatusValidation,
  deleteContactValidation} from "./contact.validation.js";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
});

const contactRouter = express.Router();
contactRouter.use(limiter);

contactRouter
  .route("/")
  .post(validate(createContactValidation),contact.createContact);

contactRouter
  .route("/all")
  .get(protectedRoutes, allowedTo("admin"), contact.getAllContacts);

contactRouter
  .route("/:id")
  .get(protectedRoutes, allowedTo("admin"),validate(getSpecificContactValidation), contact.getContactById);

contactRouter
  .route("/:id/status")
  .patch(protectedRoutes, allowedTo("admin"),validate(updateContactStatusValidation), contact.updateContactStatus);

contactRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("admin"),validate(deleteContactValidation), contact.deleteContact);

export default contactRouter;
