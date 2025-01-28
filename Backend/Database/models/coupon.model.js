
import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    maxUsagePerCustomer: {
      type: Number,
      default: 1,
    },
    totalMaxUsage: {
      type: Number,
      required: true,
    },
    currentUsageCount: {
      type: Number,
      default: 0,
    },
    usageHistory: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        usageCount: {
          type: Number,
          default: 1,
        },
        lastUsedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const couponModel = model("coupon", couponSchema);
