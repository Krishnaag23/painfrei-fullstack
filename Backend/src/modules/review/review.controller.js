import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { reviewModel } from "./../../../Database/models/review.model.js";

const addReview = catchAsyncError(async (req, res, next) => {
  req.body.userId = req.user._id;
  let isReviewed = await reviewModel.findOne({
    userId: req.user._id, 
    productId: { $eq: req.body.productId }, 
  });
  
  if (isReviewed) return next(new AppError("You created a review before", 409));
  const addReview = new reviewModel(req.body);
  await addReview.save();

  res.status(201).json({ message: "success", addReview });
});

const getAllReviews = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(reviewModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllReviews = await apiFeature.mongooseQuery;
  // console.log("This is get all reviews:",getAllReviews);
  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllReviews });
});

const getReviewsByProductId = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const reviews = await reviewModel.find({ productId });
  if (!reviews || reviews.length === 0) {
    return next(new AppError("No reviews found for this product", 404));
  }

  res.status(200).json({ message: "success", reviews });
});


const getSpecificReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);

  let result = await reviewModel.findById(id);
  // console.log(result);
  !result && next(new AppError("Review was not found", 404));
  result && res.status(200).json({ message: "success", result });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  // console.log({ user: req.user._id });
  const updateFields = {};
  if (typeof req.body.rate=== 'number') updateFields.rate = req.body.rate;
  if (typeof req.body.text === 'string') updateFields.text = req.body.text;
  
  //degub
  // console.log("This the update field:",updateFields)

  const updateReview = await reviewModel.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: updateFields },
    {
      new: true,
    }
  );

  // console.log(updateReview);

  updateReview && res.status(201).json({ message: "success", updateReview });

  !updateReview &&
    next(
      new AppError(
        "Review was not found or you're not authorized to review this project",
        404
      )
    );
});

const deleteReview = deleteOne(reviewModel, "Review");
export {
  addReview,
  getAllReviews,
  getSpecificReview,
  updateReview,
  deleteReview,
  getReviewsByProductId
};
