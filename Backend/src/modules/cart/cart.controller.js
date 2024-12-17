import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "./../../../Database/models/cart.model.js";
import { productModel } from "../../../Database/models/product.model.js";
import { couponModel } from "./../../../Database/models/coupon.model.js";
import mongoose from "mongoose";


function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItem.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;

  if (cart.discount) {
    cart.totalPriceAfterDiscount = totalPrice - (totalPrice * cart.discount) / 100;
  } else {
    cart.totalPriceAfterDiscount = totalPrice;
  }
}

const addProductToCart = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.body.productId).select("price");
  if (!product) return next(new AppError("Product not found", 404));

  req.body.price = product.price;

  let cart = await cartModel.findOne({ userId: req.user._id });

  
  if (!cart) {
    cart = await cartModel.create({
      userId: req.user._id,
      cartItem: [req.body],
    });
  } else {
    
    const existingItem = cart.cartItem.find((item) => item.productId.toString() === req.body.productId);
    if (existingItem) {
      existingItem.quantity += req.body.quantity || 1;
    } else {
      cart.cartItem.push(req.body);
    }
  }

  calcTotalPrice(cart);
  await cart.save();

  

  res.status(201).json({
    status: "success",
    message: "Product added to cart",
    data: cart,
  });
});


const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    
    { $pull: { cartItem: { productId: new mongoose.Types.ObjectId(req.params.id) } } },
    { new: true }
  );
  // console.log("Cart data before remove: ",cart);
  // console.log("product id : ",req.params.id);
  if (!cart) return next(new AppError("Cart or item not found", 404));

  calcTotalPrice(cart);
  await cart.save();

  // console.log("Cart data after remove: ",cart);

  res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    data: cart,
  });
});



const updateProductQuantity = catchAsyncError(async (req, res, next) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) return next(new AppError("Quantity must be at least 1", 400));

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  const item = cart.cartItem.find((item) => item.productId.toString() === req.params.id);
  if (!item) return next(new AppError("Product not found in cart", 404));

  item.quantity = quantity;

  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product quantity updated",
    data: cart,
  });
});


const applyCoupon = catchAsyncError(async (req, res, next) => {
  const { code } = req.body;

  const coupon = await couponModel.findOne({ code, expires: { $gt: Date.now() } });
  if (!coupon) return next(new AppError("Invalid or expired coupon", 400));

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  cart.discount = coupon.discount;
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: cart,
  });
});


const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id }).populate("cartItem.productId");
  if (!cart) return next(new AppError("Cart not found", 404));

  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    data: cart,
  });
});

const deleteLoggedUserCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOneAndDelete({ userId: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  res.status(200).json({
    status: "success",
    message: "Cart deleted successfully",
    data: null,
  });
});

export {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  applyCoupon,
  getLoggedUserCart,
  deleteLoggedUserCart,
};