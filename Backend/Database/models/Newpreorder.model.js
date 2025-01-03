import { Schema, model } from "mongoose";

const NewpreOrderSchema = new Schema({
  orderInfo: {
    productId: { type: Schema.ObjectId, ref: "product" },
    quantity: {
      type: String,
      default: "1",
    },
    price: Number,
    totalProductDiscount: Number,
  },

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

export const NewpreOrderModel = model("NewpreOrder", NewpreOrderSchema);
