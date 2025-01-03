import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { NewpreOrderModel } from "../../../Database/models/Newpreorder.model.js";

const createNewPreOrder = catchAsyncError(async (req, res, next) => {
  try {
    const NewpreOrder = new NewpreOrderModel({
      orderInfo: req.body.order,
      shippingDetails: req.body.shippingDetails,
      shippingAddress: req.body.shippingAddress,
    });

    await NewpreOrder.save();

    return res.status(201).json({ message: "success", NewpreOrder });
  } catch (error) {
    return next(new AppError(error, 400));
  }
});

export { createNewPreOrder };
