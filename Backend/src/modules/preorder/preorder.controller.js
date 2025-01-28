import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { NewpreOrderModel } from "../../../Database/models/Newpreorder.model.js";
import nodemailer from "nodemailer";

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

export { createNewPreOrder };
