// import { CouponService } from "./coupon.service.js";
// import customers from "./preorders.json" assert { type: "json" };
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import { dbConnection } from "../../../Database/dbConnection.js";

// dotenv.config();
// console.log(customers);
// dbConnection();

// const sendPreorderAnnouncementEmail = async (
//   recipientEmail,
//   customerName,
//   couponCode,
//   expiryDays,
//   discountAmount
// ) => {
//   // console.log(process.env.EMAIL_USERNAME);
//   // Example expiry period
//   const transporter = nodemailer.createTransport({
//     host: "smtp.hostinger.com",
//     port: 465, // Use 465 for SSL/TLS
//     secure: true, // Use SSL
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const emailBody = `
// <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
//     <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <header style="text-align: center; padding: 10px 0; border-bottom: 2px solid #4caf50;">
//             <h2 style="color: #4caf50; margin: 0; font-size: 24px;">Great News!</h2>
//             <p style="color: #777; font-size: 14px; margin: 5px 0 0;">Your Wait Is Finally Over</p>
//         </header>

//         <section style="margin: 20px 0;">
//             <p>Dear <strong>${customerName}</strong>,</p>
            
//             <p>We're thrilled to announce that the product you've been waiting for is now available for purchase! As one of our valued pre-order customers, we want to thank you for your patience and trust in Painfrei Care & Wellness.</p>

//             <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                 <p style="font-size: 18px; color: #4caf50; margin: 0;">🎉 Exclusive Discount for Pre-order Customers</p>
//                 <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">Use Coupon Code: ${couponCode}</p>
//                 <p style="color: #666; font-size: 14px;">Valid for ${expiryDays} days only</p>
//             </div>

//             <p><strong>How to Order:</strong></p>
//             <ol style="margin-bottom: 20px;">
//                 <li>Visit our website at <a href="https://www.painfrei.com" style="color: #4caf50; text-decoration: none;">www.painfrei.com</a></li>
//                 <li>Select your desired product</li>
//                 <li>Apply your exclusive discount code at checkout</li>
//                 <li>Complete your purchase</li>
//             </ol>

//             <p style="color: #ff6b6b;"><strong>Note:</strong> This special discount code will expire in ${expiryDays} days, so don't miss out!</p>
//         </section>

//         <section style="margin-top: 20px;">
//             <p>Need assistance? We're here to help:</p>
//             <p>
//                 <strong>Email:</strong> <a href="mailto:contact@painfrei.com" style="color: #4caf50; text-decoration: none;">contact@painfrei.com</a>
//             </p>
//         </section>

//         <footer style="margin-top: 30px; text-align: center; border-top: 2px solid #4caf50; padding-top: 10px; font-size: 12px; color: #777;">
//             <p style="margin: 0;">Thank you for choosing Painfrei Care & Wellness!</p>
//             <p style="margin: 0;">Your wellness journey begins here.</p>
//         </footer>
//     </div>
// </div>
// `;

//   await transporter.sendMail({
//     from: '"Painfrei Care & Wellness" <contact@painfrei.com>',
//     to: recipientEmail,
//     subject: "🎉 Your Wait Is Over - Special Launch Offer Inside!",
//     html: emailBody,
//   });
// };
// // console.log(customers);

// async function generateAndSendCouponCode(customers) {
//   const coupons = await CouponService.createBulkCoupons({
//     count: customers.length,
//     discount: 40,
//     expiryDays: 3,
//     maxUsagePerCustomer: 1,
//     totalMaxUsage: 1,
//     prefix: "Pain",
//   });
//   await sendBulkCouponEmails(customers, coupons);
// }

// const sendBulkCouponEmails = async (customers, coupons) => {
//   for (let i = 0; i < customers.length; i++) {
//     const customer = customers[i];
//     const coupon = coupons[i];

//     try {
//       await sendPreorderAnnouncementEmail(
//         customer.email,
//         customer.name,
//         coupon.code,
//         Math.ceil((coupon.expires - new Date()) / (1000 * 60 * 60 * 24)), // Convert to days
//         coupon.discount
//       );
//       console.log(`Email sent to ${customer.email}`);
//       // Add delay between emails
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (error) {
//       console.error(`Failed to send email to ${customer.email}:`, error);
//     }
//   }
// };

// generateAndSendCouponCode(customers).catch(console.error);
