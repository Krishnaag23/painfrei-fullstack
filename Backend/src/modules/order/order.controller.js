import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { productModel } from "../../../Database/models/product.model.js";
import { orderModel } from "../../../Database/models/order.model.js";
import { razorpayInstance } from "../../utils/razorpay.js";
import { userModel } from "../../../Database/models/user.model.js";
import crypto from "crypto";

const createRazorpayOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("Cart was not found", 404));

  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const options = {
    amount: totalOrderPrice * 100, 
    currency: "INR",
    receipt: `order_rcptid_${req.params.id}`,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  if (!razorpayOrder) return next(new AppError("Error creating Razorpay order", 500));

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: options.amount,
    currency: options.currency,
  });
});

const verifyRazorpayPayment = catchAsyncError(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return next(new AppError("Invalid signature, payment verification failed", 400));
  }

  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("Cart was not found", 404));

  const order = new orderModel({
    userId: req.user._id,
    cartItems: cart.cartItem,
    totalOrderPrice: cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod: "card",
    paymentStatus: "paid",
    isPaid: true,
    paidAt: Date.now(),
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();

  
  const bulkUpdateOptions = cart.cartItem.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
    },
  }));
  await productModel.bulkWrite(bulkUpdateOptions);

  await cartModel.findByIdAndDelete(req.params.id);

  res.status(201).json({ success: true, message: "Payment verified and order created", order });
});


const createCashOrder = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);
  // console.log(cart);
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  console.log(cart.cartItem);
  const order = new orderModel({
    userId: req.user._id,
    cartItem: cart.cartItem,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();

  // console.log(order);
  if (order) {
    let options = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(options);

    await cartModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ message: "success", order });
  } else {
    next(new AppError("Error in cart ID", 404));
  }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);

  let order = await orderModel
    .findOne({ userId: req.user._id })
    .populate("cartItems.productId");

  res.status(200).json({ message: "success", order });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.findOne({}).populate("cartItems.productId");

  res.status(200).json({ message: "success", orders });
});




export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  verifyRazorpayPayment,
  createRazorpayOrder  
};
