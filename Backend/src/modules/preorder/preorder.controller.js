import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { productModel } from "../../../Database/models/product.model.js";
import { preOrderModel } from "../../../Database/models/preorder.model.js";

const createPreOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.params.id });
  if (!cart) return next(new AppError("Cart was not found", 404));
  // console.log(cart);

  // console.log(cart.cartItem);
  const preOrder = new preOrderModel({
    userId: req.user._id,
    cartItems: cart.cartItem,
    totalOrderPrice: cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalPrice,
    shippingDetails: req.body.shippingDetails,
    shippingAddress: req.body.shippingAddress,
  });

  await preOrder.save();

  // console.log(order);
  if (preOrder) {
    let options = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(options);

    await cartModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ message: "success", preOrder });
  } else {
    next(new AppError("Error in cart ID", 404));
  }
});

export { createPreOrder };
