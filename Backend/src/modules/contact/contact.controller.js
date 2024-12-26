import { ContactModel } from "../../../Database/models/contact.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";

// Create a new contact submission
const createContact = catchAsyncError(async (req, res, next) => {
  const { name, email, message, phone } = req.body;

  // Validate input
  if (!name || !email) {
    return next(new AppError("Name, email, and message are required.", 400));
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(new AppError("Please provide a valid email address.", 400));
  }

  const contact = await ContactModel.create({ name, email, message, phone });

  res.status(201).json({
    success: true,
    message: "Contact submission created successfully.",
    contact
  });
});

// Get all contact submissions
const getAllContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await ContactModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Contact submissions fetched successfully.",
    contacts,
  });
});

// Get a single contact by ID
const getContactById = catchAsyncError(async (req, res, next) => {
  const contact = await ContactModel.findById(req.params.id);

  if (!contact) {
    return next(new AppError("Contact not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Contact retrieved successfully.",
    contact,
  });
});

// Update contact status
const updateContactStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;

  if (!["new", "in-progress", "resolved"].includes(status)) {
    return next(new AppError("Invalid status value. Allowed values: new, in-progress, resolved.", 400));
  }

  const contact = await ContactModel.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return next(new AppError("Contact not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Contact status updated successfully.",
    contact,
  });
});

// Delete a contact
const deleteContact = catchAsyncError(async (req, res, next) => {
  const contact = await ContactModel.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError("Contact not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Contact deleted successfully.",
  });
});

export {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
