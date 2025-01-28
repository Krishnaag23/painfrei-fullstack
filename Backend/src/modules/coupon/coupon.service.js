import { couponModel } from "../../../Database/models/coupon.model.js";
import crypto from "crypto";



export class CouponService {
  static generateUniqueCode(length = 8) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .toUpperCase()
      .slice(0, length);
  }

  static async createBulkCoupons({
    count,
    discount,
    expiryDays,
    maxUsagePerCustomer = 1,
    totalMaxUsage = 1,
    prefix = "",
  }) {
    const coupons = [];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    for (let i = 0; i < count; i++) {
      const code = `${prefix}${this.generateUniqueCode(8)}`;
      coupons.push({
        code,
        discount,
        expires: expiryDate,
        maxUsagePerCustomer,
        totalMaxUsage,
        currentUsageCount: 0,
        usageHistory: [],
      });
    }

    return await couponModel.insertMany(coupons);
  }

  static async validateAndUpdateCouponUsage(code, userId) {
    const coupon = await couponModel.findOne({ code });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (coupon.expires < new Date()) {
      throw new Error("Coupon has expired");
    }

    if (coupon.currentUsageCount >= coupon.totalMaxUsage) {
      throw new Error("Coupon usage limit exceeded");
    }

    const userUsage = coupon.usageHistory.find(
      (history) => history.userId.toString() === userId.toString()
    );

    if (userUsage && userUsage.usageCount >= coupon.maxUsagePerCustomer) {
      throw new Error("You have exceeded the usage limit for this coupon");
    }

    // Update usage
    if (userUsage) {
      userUsage.usageCount += 1;
      userUsage.lastUsedAt = new Date();
    } else {
      coupon.usageHistory.push({
        userId,
        usageCount: 1,
        lastUsedAt: new Date(),
      });
    }

    coupon.currentUsageCount += 1;
    await coupon.save();

    return coupon;
  }
}
