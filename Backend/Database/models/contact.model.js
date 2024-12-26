import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name should be at least 3 characters long"],
      maxlength: [50, "Name should not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [/.+@.+\..+/, "Invalid email format"], // Regex for basic email validation
    },
    message: {
      type: String,
      minlength: [10, "Message should be at least 10 characters long"],
      maxlength: [500, "Message should not exceed 500 characters"],
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number should be 10 digits"],
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

// Log when a new contact is submitted
contactSchema.post("save", function (doc) {
  console.log(`New contact submission:`, doc);
});

// Avoid showing the __v field when querying
contactSchema.pre(["find", "findOne"], function () {
  this.select("-__v");
});

export const ContactModel = model("Contact", contactSchema);

