import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_OiBA7cCO0ITPfS",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "fpto8kafpY6eDRauWRJYuOwk",
});
