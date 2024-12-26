import Joi from "joi";

const createContactValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number",
    }),
  message: Joi.string().optional().trim().min(10).max(500).messages({
    "string.min": "Message should have at least 10 characters",
    "string.max": "Message should not exceed 500 characters",
  }),
});

const getSpecificContactValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.empty": "Contact ID is required",
    "string.hex": "Contact ID must be a valid hexadecimal string",
    "string.length": "Contact ID must be exactly 24 characters long",
  }),
});

const updateContactStatusValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.empty": "Contact ID is required",
    "string.hex": "Contact ID must be a valid hexadecimal string",
    "string.length": "Contact ID must be exactly 24 characters long",
  }),
  status: Joi.string()
    .valid("new", "in-progress", "resolved")
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": "Status must be one of: new, in-progress, resolved",
    }),
});

const deleteContactValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.empty": "Contact ID is required",
    "string.hex": "Contact ID must be a valid hexadecimal string",
    "string.length": "Contact ID must be exactly 24 characters long",
  }),
});

export {
  createContactValidation,
  getSpecificContactValidation,
  updateContactStatusValidation,
  deleteContactValidation,
};
