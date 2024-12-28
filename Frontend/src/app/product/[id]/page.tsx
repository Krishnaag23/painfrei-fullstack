"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const ProductPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userReview, setUserReview] = useState({ text: "", rate: 5 });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}products/${params.id}`,
        );
        setProduct(data.getSpecificProduct);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const fetchAllReviews = async () => {
    try {
      setCurrentUserID(user._id);
      // console.log(currentUserID);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}review/product/${params.id}`,
      );
      setProduct((prev: any) => ({
        ...prev,
        reviews: data.reviews,
      }));
    } catch (error) {
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, [user]);

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}review/${editingReview._id}`,
        {
          text: userReview.text,
          rate: userReview.rate,
        },
        { headers: { token: localStorage.getItem("token") } },
      );
      toast.success("Review updated successfully");
      setIsEditing(false);
      setEditingReview(null);
      setUserReview({ text: "", rate: 5 });
      await fetchAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId: any) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}review/${reviewId}`,
        { headers: { token: localStorage.getItem("token") } },
      );
      toast.success("Review deleted successfully");
      await fetchAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const startEditReview = (review: any) => {
    setIsEditing(true);
    setEditingReview(review);
    setUserReview({
      text: review.text,
      rate: review.rate,
    });
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}carts/`,
        {
          productId: params.id,
          quantity,
        },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}review/`,
        {
          productId: params.id,
          ...userReview,
        },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      toast.success("Review added successfully");
      setUserReview({ text: "", rate: 5 });
      // Refresh product data to show new review
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}products/${params.id}`,
      );
      setProduct(data.getSpecificProduct);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-36 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 pt-36 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="/"
                className="hover:text-primary dark:hover:text-primary/90"
              >
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a
                href="/products"
                className="hover:text-primary dark:hover:text-primary/90"
              >
                Products
              </a>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="rounded-2xl bg-main p-6 shadow-sm dark:bg-gray-800 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl">
                <Image
                  src={product.images[selectedImage] || product.imgCover}
                  alt={product.title}
                  className="h-[400px] w-full transform object-cover transition-transform hover:scale-105 sm:h-[500px]"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative overflow-hidden rounded-lg transition-all
                      ${
                        selectedImage === idx
                          ? "scale-105 transform ring-2 ring-primary dark:ring-primary/90"
                          : "hover:ring-2 hover:ring-primary/90 dark:hover:ring-blue-300"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`Product ${idx + 1}`}
                      className="h-20 w-full object-cover sm:h-24"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                  {product.title}
                </h1>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary dark:text-primary/90">
                      ₹{product.priceAfterDiscount || product.price}
                    </p>
                    {/* {product.priceAfterDiscount && (
                      <p className="text-lg text-gray-500 line-through dark:text-gray-400">
                        ₹{product.price}
                      </p>
                    )} */}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stock Status
                    </p>
                    <p
                      className={`font-medium ${
                        product.quantity > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity:
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="rounded-md border-gray-300 bg-white 
                               px-4 py-2 text-gray-900 focus:border-primary
                               focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 
                               dark:focus:border-primary/90 dark:focus:ring-primary/90"
                    >
                      {[...Array(Math.min(10, product.quantity))].map(
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.quantity === 0}
                  className="w-full transform rounded-xl bg-primary px-8 py-4 
                           font-medium text-white transition-all hover:bg-primary/90 
                           focus:ring-4 focus:ring-blue-200 active:scale-95
                           disabled:cursor-not-allowed disabled:bg-gray-300 
                           dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary/80 dark:disabled:bg-gray-600"
                >
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 rounded-2xl bg-main p-6 shadow-sm dark:bg-gray-800 sm:p-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Customer Reviews
          </h2>

          <div className="space-y-8">
            {/* Reviews Section */}
            {product.reviews?.length > 0 ? (
              product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-0 dark:border-gray-700"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    {/* User Info */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {review.userId.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {currentUserID === review.userId._id && (
                        <div className="mt-2 flex gap-4">
                          <button
                            onClick={() => startEditReview(review)}
                            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Rating Section */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <StarIcon
                          key={idx}
                          className={`h-5 w-5 ${
                            idx < review.rate
                              ? "text-yellow-400 dark:text-yellow-300"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Review Text */}
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    {review.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}

            {/* Add Review Form */}
            <form
              onSubmit={isEditing ? handleUpdateReview : handleAddReview}
              className="space-y-6 rounded-lg border border-gray-200 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Review Textarea */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Write a Review
                </label>
                <textarea
                  value={userReview.text}
                  onChange={(e) =>
                    setUserReview((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white 
                   px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary
                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 
                   dark:focus:border-primary/90 dark:focus:ring-primary/90"
                  rows={4}
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>
              {/* Rating and Submit */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-full sm:w-auto">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating
                  </label>
                  <select
                    value={userReview.rate}
                    onChange={(e) =>
                      setUserReview((prev) => ({
                        ...prev,
                        rate: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 
                     py-2 text-gray-900 focus:border-primary focus:ring-primary 
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 
                     dark:focus:border-primary/90 dark:focus:ring-primary/90"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="transform rounded-lg bg-primary px-6 py-3 
                   font-medium text-white transition-all hover:bg-primary/90 
                   focus:ring-4 focus:ring-primary/40 active:scale-95 dark:bg-primary 
                   dark:hover:bg-primary/90 dark:focus:ring-primary/80"
                >
                  {isEditing ? "Update Review" : "Submit Review"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingReview(null);
                      setUserReview({ text: "", rate: 5 });
                    }}
                    className="text-sm font-medium text-gray-600 hover:underline dark:text-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Reviews List */}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
