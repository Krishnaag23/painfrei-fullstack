import { Schema, model } from "mongoose";

const preOrderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: "user",
  },
  cartItems: [
    {
      productId: { type: Schema.ObjectId, ref: "product" },
      quantity: {
        type: Number,
        default: 1,
      },
      price: Number,
      totalProductDiscount: Number,
    },
  ],
  shippingDetails: {
    name: String,
    email: String,
  },
  shippingAddress: {
    street: String,
    state: String,
    city: String,
    pin: Number,
    phone: Number,
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash"],
    default: "cash",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  deliveredAt: Date,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
});

export const preOrderModel = model("preOrder", preOrderSchema);
