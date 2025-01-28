import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { productModel } from "../../../Database/models/product.model.js";
import { orderModel } from "../../../Database/models/order.model.js";
import { razorpayInstance } from "../../utils/razorpay.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // Use 465 for SSL/TLS
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
console.log("Email username:", process.env.EMAIL_USERNAME);
console.log("Email password:", process.env.EMAIL_PASSWORD);
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP configuration error in orders:", error);
  } else {
    console.log(
      "SMTP configuration is correct. Server is ready to send order confirmation emails."
    );
  }
});

const sendOrderConfirmationEmail = async (
  recipientEmail,
  orderDetails,
  shippingAddress
) => {
  const { name, productName, quantity, totalPrice } = orderDetails;
  const { street, city, state, phone } = shippingAddress;

  const emailBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <header style="text-align: center; padding: 10px 0; border-bottom: 2px solid #4caf50;">
            
            <h2 style="color: #4caf50; margin: 0; font-size: 24px;">Order Confirmation</h2>
            <p style="color: #777; font-size: 14px; margin: 5px 0 0;">Thank you for shopping with <strong>Painfrei Care & Wellness</strong></p>
        </header>

        <section style="margin: 20px 0;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>We are thrilled to confirm your order. Below are the details:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">${productName}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${totalPrice.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total:</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${totalPrice.toFixed(
                          2
                        )}</td>
                    </tr>
                </tbody>
            </table>

            <h3 style="color: #4caf50; margin-bottom: 10px;">Pickup Location</h3>
            <p style="margin: 0; line-height: 1.6;">
                <br />
                House No: 369, Chandel Gate, Nankari, IIT Kanpur<br />
                Kanpur, Uttar Pradesh
            </p>
            <p style="margin-top: 10px; font-weight: bold;">If your order is from Kanpur,Your order will be available for pickup from the above location during our working hours. Please bring a valid ID and your order confirmation.</p>
        </section>

        <section style="margin-top: 20px;">
            <p>If you have any questions, please feel free to contact us:</p>
            <p>
                <strong>Email:</strong> <a href="mailto:contact@painfrei.com" style="color: #4caf50; text-decoration: none;">contact@painfrei.com</a><br />
                
            </p>
        </section>

        <footer style="margin-top: 30px; text-align: center; border-top: 2px solid #4caf50; padding-top: 10px; font-size: 12px; color: #777;">
            <p style="margin: 0;">Thank you for choosing Painfrei Care & Wellness!</p>
            <p style="margin: 0;">We look forward to serving you again.</p>
        </footer>
    </div>
</div>

`;

  await transporter.sendMail({
    from: '"Painfrei Care & Wellness" <contact@painfrei.com>',
    to: recipientEmail,
    subject: "Your Order Confirmation - Soothwave Wellness",
    html: emailBody,
  });
};

const createRazorpayOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.params.id });
  if (!cart) return next(new AppError("Cart was not found", 404));

  const totalOrderPrice = cart.totalPriceAfterDiscount || cart.totalPrice;

  const options = {
    amount: totalOrderPrice * 100,
    currency: "INR",
    receipt: `order_rcptid_${req.params.id}`,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  if (!razorpayOrder)
    return next(new AppError("Error creating Razorpay order", 500));

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: options.amount,
    cartId: cart._id,
    currency: options.currency,
  });
});

const verifyRazorpayPayment = catchAsyncError(async (req, res, next) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    shippingDetails,
    shippingAddress,
  } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return next(
      new AppError("Invalid signature, payment verification failed", 400)
    );
  }

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) return next(new AppError("Cart was not found", 404));

  const order = new orderModel({
    userId: req.user._id,
    cartItems: cart.cartItem,
    totalOrderPrice: cart.totalPriceAfterDiscount || cart.totalPrice,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod: "card",
    paymentStatus: "paid",
    isPaid: true,
    paidAt: Date.now(),
    shippingDetails,
    shippingAddress,
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
  try {
    await cartModel.findOneAndDelete({ userId: req.user._id });
    console.log("Successfully Deleted Cart", req.user._id);
  } catch (error) {
    console.error("Error deleting user cart ", error);
  }
  try {
    await sendOrderConfirmationEmail(
      shippingDetails.email,
      {
        name: shippingDetails.name,
        productName: "Pain Relief Oil",
        quantity: cart.cartItem[0].quantity,
        totalPrice: cart.totalPriceAfterDiscount || cart.totalPrice,
      },
      shippingAddress
    );
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }

  res.status(201).json({
    success: true,
    message: "Payment verified and order created",
    order,
  });
});

const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.params.id });
  if (!cart) return next(new AppError("Cart was not found", 404));
  // console.log(cart);
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  // console.log(cart.cartItem);
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
  // console.log(req.user._id);

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
  createRazorpayOrder,
};
