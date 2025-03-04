import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { NewpreOrderModel } from "../../../Database/models/Newpreorder.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Razorpay from "razorpay";
import { productModel } from "../../../Database/models/product.model.js";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order for Preorders
const createPreOrderPayment = catchAsyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity) {
    return next(new AppError("Product ID and quantity are required", 400));
  }

  // Get product details
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Calculate amount
  const price = product.priceDiscount || product.price;
  const totalAmount = price * quantity;

  // Create Razorpay order
  const options = {
    amount: totalAmount * 100, // Convert to paise
    currency: "INR",
    receipt: `preorder_${Date.now()}`,
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      productId,
      quantity,
      totalAmount,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return next(new AppError("Error creating payment order", 500));
  }
});

// Verify Preorder Payment
const verifyPreOrderPayment = catchAsyncError(async (req, res, next) => {
  const { shippingDetails, shippingAddress, productId, quantity } = req.body;
  const razorpayOrderId = req.body.razorpay_order_id;
  const razorpayPaymentId = req.body.razorpay_payment_id;
  const razorpaySignature = req.body.razorpay_signature;

  // Validate required fields
  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature || 
    !shippingDetails ||
    !shippingAddress ||
    !productId ||
    !quantity
  ) {
    return next(new AppError("Missing required fields", 400));
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return next(new AppError("Invalid payment signature", 400));
  }

  // Create preorder record
  try {
    const newPreOrder = new NewpreOrderModel({
      orderInfo: {
        productId,
        quantity,

        totalProductDiscount: 0, // Add discount logic if needed
      },
      shippingDetails,
      shippingAddress,
      paymentMethod: "card",
      isPaid: true,
      paidAt: Date.now(),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: "paid",
    });

    await newPreOrder.save();

    // Update product inventory
    await productModel.findByIdAndUpdate(productId, {
      $inc: { quantity: -quantity, sold: quantity },
    });

    // Send confirmation email (uncomment when ready)
    // await sendOrderConfirmationEmail(...);

    res.status(201).json({
      success: true,
      message: "Preorder payment verified and order created",
      preOrder: newPreOrder,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return next(new AppError("Error saving preorder details", 500));
  }
});

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
    console.error("SMTP configuration error:", error);
  } else {
    console.log(
      "SMTP configuration is correct. Server is ready to send pre-order confirmation emails."
    );
  }
});

const sendOrderConfirmationEmail = async (
  recipientEmail,
  orderDetails,
  pickupLocation
) => {
  console.log(recipientEmail, orderDetails, pickupLocation);
  const { name, quantity, productId } = orderDetails;
  const { address, city, phone, state } = pickupLocation;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #4caf50; text-align: center;">Pre-Order Confirmation</h2>
      <p style="text-align: center;">Thank you for your order with <strong>Soothwave Wellness Solutions Pvt Ltd</strong>, an IIT Kanpur startup revolutionizing wellness with cutting-edge technology.</p>

      <h3 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="border: 1px solid #e0e0e0; padding: 10px; text-align: left;">Product</th>
            <th style="border: 1px solid #e0e0e0; padding: 10px; text-align: left;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 10px;">Pain Relief Oil</td>
            <td style="border: 1px solid #e0e0e0; padding: 10px;">${quantity}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Pickup Location</h3>
      <p style="margin-bottom: 20px;">
        House No. 369, Chandel Gate, Nankari, IIT Kanpur<br />
        Kanpur, U.P.<br />
      </p>

      <p style="text-align: center; font-style: italic;">Your order will be available for pickup from the above location. Please bring a valid ID and your order confirmation.</p>

      <p>If you have any questions or need further assistance, feel free to reach out to us:</p>
      <p>
        Email: <a href="mailto:contact@painfrei.com" style="color: #4caf50; text-decoration: none;">contact@painfrei.com</a><br />
        Phone: +91 9876543210
      </p>

      <p style="text-align: center;">Thank you for choosing <strong>Soothwave Wellness Solutions Pvt Ltd</strong>.<br />We look forward to serving you again!</p>

      <div style="text-align: center; margin-top: 20px;">
        <img src="https://www.painfrei.com/_next/image?url=%2Fimages%2Flogo%2Flogo-pan-rmbg.png&w=1080&q=75" alt="Brand Logo" style="border-radius: 50%; width: 100px; height: 100px;" />
      </div>
    </div>
  `;

  // await transporter.sendMail({
  //   from: '"Painfrei Care & Wellness" <contact@painfrei.com>',
  //   to: recipientEmail,
  //   subject: "Your Pre-Order Confirmation - Soothwave Wellness",
  //   html: emailBody,
  // });
};

const createNewPreOrder = catchAsyncError(async (req, res, next) => {
  const { shippingDetails, shippingAddress } = req.body;

  try {
    const NewpreOrder = new NewpreOrderModel({
      orderInfo: req.body.order,
      shippingDetails: req.body.shippingDetails,
      shippingAddress: req.body.shippingAddress,
    });

    await NewpreOrder.save();
    // try {
    //   console.log("Sending order confirmation email...");
    //   await sendOrderConfirmationEmail(
    //     shippingDetails.email,
    //     {
    //       name: shippingDetails.name,
    //       quantity: req.body.quantity,
    //       productId: req.body.productId,
    //     },
    //     shippingAddress
    //   );
    //   console.log("Order confirmation email sent!");
    // } catch (error) {
    //   console.error("Error sending order confirmation email:", error);
    // }

    return res.status(201).json({ message: "success", NewpreOrder });
  } catch (error) {
    return next(new AppError(error, 400));
  }
});

export { createNewPreOrder, createPreOrderPayment, verifyPreOrderPayment };
