"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import TokenHandler from "@/components/tokenHandler";
import FAQ from "@/components/FAQ";

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
  const [pinCode, setPinCode] = useState("");
  const [isDeliverable, setIsDeliverable] = useState(null);
  const [savedPinCode, setSavedPinCode] = useState("");

  const { user } = useAuth();
  const deliverablePinCodes = [
    208002, 209401, 208011, 208003, 209401, 208009, 208009, 208002, 208017,
    208001, 209217, 208017, 209401, 208027, 208027, 209401, 209401, 209402,
    209305, 209214, 209305, 209402, 209305, 209214, 208024, 209304, 208001,
    209304, 209217, 208007, 208008, 209305, 208008, 208003, 209214, 209214,
    208013, 208001, 208001, 208012, 209214, 209214, 208001, 208013, 208001,
    208001, 209304, 208007, 209214, 209401, 209401, 208006, 208006, 208002,
    208001, 208007, 209401, 209214, 208007, 209402, 208001, 208002, 208005,
    208016, 208026, 208005, 209217, 208010, 209214, 209402, 208012, 209304,
    208014, 208001, 208024, 209214, 209214, 208017, 209402, 208004, 208001,
    208001, 208001, 209402, 208021, 209214, 209214, 208021, 208012, 208017,
    208017, 208011, 208007, 209401, 209402, 209402, 209402, 209402, 209214,
    208001, 208002, 208003, 208004, 208005, 208006, 208007, 208008, 208009,
    208010, 208011, 208012, 208013, 208014, 208015, 208016, 208017, 208018,
    208019, 208020, 208021, 208022, 208023, 208024, 208025, 208026, 208027,
    209217, 208004, 243503,
  ];
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}products/${params.id}`,
        );
        setProduct(data.getSpecificProduct);
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    const storedPinCode = localStorage.getItem("userPinCode");
    if (storedPinCode) {
      setSavedPinCode(storedPinCode);
      setIsDeliverable(deliverablePinCodes.includes(parseInt(storedPinCode)));
    }
  }, []);

  const handleCheckDelivery = () => {
    if (pinCode.trim() === "") {
      alert("Please enter a pin code.");
      return;
    }
    const deliverable = deliverablePinCodes.includes(parseInt(pinCode));
    setIsDeliverable(deliverable);
    localStorage.setItem("userPinCode", pinCode); // Save the pin code in local storage
    setSavedPinCode(pinCode);
  };
  const handleClearSavedPin = () => {
    localStorage.removeItem("userPinCode");
    setSavedPinCode("");
    setIsDeliverable(null);
    setPinCode("");
  };
  const fetchAllReviews = async () => {
    if (!user) return; // Add this check

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}review/product/${params.id}`,
      );
      setProduct((prev) => ({
        ...prev,
        reviews: data.reviews,
      }));
      setCurrentUserID(user._id);
    } catch (error) {
      // Only show error if it's not a 404
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch reviews");
      }
    }
  };

  useEffect(() => {
    if (user && params.id) {
      fetchAllReviews();
    }
  }, [user, params.id]);

  useEffect(() => {
    const quantity = Number(localStorage.getItem("quantity"));
    const productId = localStorage.getItem("productId");

    if (quantity && productId && user) {
      setLoading(true);
      setIsAddingToCart(true);
      try {
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}carts/`,
          {
            productId,
            quantity,
          },
          { headers: { token: `${localStorage.getItem("token")}` } },
        );

        setTimeout(() => {
          window.location.href = "/dashboard/cart";
        }, 1000);
      } catch (error) {
        console.log("Error adding to cart:", error);
        toast.error(error.response?.data?.message || "Failed to add to cart");
      } finally {
        localStorage.removeItem("quantity");
        localStorage.removeItem("productId");
        setIsAddingToCart(false);
      }
    }
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
    if (!savedPinCode) {
      toast.error("Please check delivery availability before proceeding.");
      return;
    }
    localStorage.setItem("isDeliverable", isDeliverable);
    localStorage.setItem("quantity", quantity.toString());
    localStorage.setItem("productId", params.id);
    if (!isDeliverable) {
      handlePreOrder();
      return;
    }
    if (!user) {
      toast("Please Login to add to cart");
      setTimeout(() => {
        window.location.href = "/signup";
      }, 1000);
      return;
    }
    localStorage.setItem("isDeliverable", isDeliverable);
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
      setTimeout(() => {
        window.location.href = "/dashboard/cart";
      }, 1000);
    } catch (error) {
      console.log("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add a review");
      return;
    }
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
  const handlePreOrder = async () => {
    localStorage.setItem("productId", params.id);
    localStorage.setItem("isDeliverable", isDeliverable);
    localStorage.setItem("quantity", quantity.toString());

    window.location.href = "/dashboard/checkout";
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
      <TokenHandler />
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
                href="/product"
                className="hover:text-primary dark:hover:text-primary/90"
              >
                Products
              </a>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100">
              Pain Relief Oil
            </li>
          </ol>
        </nav>

        {params.id === "9577c2ac834547236c297681" ? (
          <></>
        ) : (
          <>
            <div className="container mx-auto rounded-2xl bg-main p-6 shadow-sm dark:bg-gray-800 sm:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl">
                    <Image
                      src="/images/product/painfrei-oil.png"
                      alt="Painfrei Oil"
                      width={500}
                      height={500}
                      className="h-[300px] w-full transform object-cover transition-transform hover:scale-105 sm:h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">
                      {product.title}
                    </h1>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                      Experience the soothing properties of Painfrei Pain Relief
                      Oil, meticulously crafted to provide effective relief from
                      various aches and discomforts. Infused with a unique blend
                      of modern and Ayurvedic ingredients, our oil harnesses the
                      healing power of nature to promote wellness and restore
                      balance in your life.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Pricing and Stock Status */}
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xl font-bold text-primary dark:text-primary/90 sm:text-2xl">
                          ₹649.00
                        </p>
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

                    {/* Quantity Selector */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity:
                        </label>
                        <select
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-primary/90 dark:focus:ring-primary/90"
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

                    {/* Delivery Check Section */}
                    <div className="rounded-lg p-6 shadow-lg dark:bg-gray-800">
                      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
                        Check Delivery Availability
                      </h2>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          placeholder="Pin Code"
                          className="w-full flex-1 rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                        />
                        <button
                          onClick={handleCheckDelivery}
                          className="w-full rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/50 sm:w-auto"
                        >
                          Check
                        </button>
                      </div>

                      {isDeliverable !== null && (
                        <div
                          className={`mt-4 rounded-lg p-4 text-center ${
                            isDeliverable
                              ? "bg-green-100 dark:bg-green-900 dark:text-green-300 text-primary"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {isDeliverable && savedPinCode
                            ? `Hooray! We deliver to ${savedPinCode}. Add to cart now!`
                            : `Oops! We currently don't deliver to ${savedPinCode}. However, you can still preorder, and we'll notify you once delivery becomes available in your area.`}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || product.quantity === 0}
                      className="w-full transform rounded-xl bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90 focus:ring-4 focus:ring-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary/80 dark:disabled:bg-gray-600"
                    >
                      {!isDeliverable && savedPinCode
                        ? "Preorder Now"
                        : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <FAQ />
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
