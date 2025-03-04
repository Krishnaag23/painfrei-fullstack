"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [instagramClicked, setInstagramClicked] = useState(false);
  const [secondDiscountClicked, setSecondDiscountClicked] = useState(false);

  const [instagramClicks, setInstagramClicks] = useState(0);

  // Handle Instagram Click
  const handleInstagramClick = async () => {
    try {
      setError("");
      setInstagramClicks((prev) => prev + 1);
      window.open(
        "https://www.instagram.com/painfreicare/",
        "_blank",
        "noopener,noreferrer",
      );
    } catch (err) {
      // console.error("Error following on Instagram:", err);
      setError(err.error);
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/apply-coupon",
        { code: "PAIN5" },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setCart(response.data.cart);
      setCouponCode("");
      await fetchCart();
      setInstagramClicked(true);

      setSuccessMsg("Offer applied successfully!");
    } catch (err) {
      setError(err.response.data.error);
      // console.error("Error applying coupon:", err);
    }
  };

  const handleSecondDiscount = async () => {
    setLoading(true);
    try {
      setSecondDiscountClicked(true);
      window.open(
        "https://www.instagram.com/the_painfrei_guy/",
        "_blank",
        "noopener,noreferrer",
      );
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/apply-coupon",
        { code: "PAIN10" },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );

      setCart(response.data.cart);

      setSuccessMsg("Extra 5% discount applied!");
      await fetchCart();
      setLoading(false);
    } catch (error) {
      setError("Failed to apply additional discount.");
    }
  };
  // Fetch Cart Data from Backend
  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/",
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setCart(response.data.data);
    } catch (err) {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  // Remove Item from Cart
  const handleRemove = async (itemId) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setSuccessMsg("Item removed successfully.");
      await fetchCart(); // Re-fetch updated cart after removal
    } catch {
      setError("Failed to remove item.");
    }
  };

  // Update Item Quantity
  const handleQuantityChange = async (itemId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) return; // Prevent invalid quantity

    try {
      await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { quantity },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setSuccessMsg("Quantity updated.");
      await fetchCart(); // Re-fetch updated cart after quantity change
    } catch {
      setError("Failed to update item quantity.");
    }
  };

  // Apply Coupon Code
  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/apply-coupon",
        { code: couponCode },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setCart(response.data.cart);
      setCouponCode("");
      await fetchCart(); // Re-fetch updated cart after coupon applied
      setSuccessMsg("Coupon applied successfully!");
    } catch {
      setError("Invalid or Expired Coupon Code.");
    }
  };

  // Proceed to Checkout
  const handleCheckout = () => {
    // console.log("Cart: ", cart);
    localStorage.setItem("quantity", cart.cartItem[0].productId.quantity);
    localStorage.setItem("productID", cart.cartItem[0].productId.id);
    router.push("/dashboard/checkout");
  };

  if (!cart || cart.cartItem.length === 0) {
    return (
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-36">
        <h1 className="mb-6 text-center text-3xl font-bold">Your Cart</h1>
        <div className="text-center">Your cart is empty!</div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Cart" />
      <div className="relative mx-auto max-w-4xl px-4 pb-16">
        <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Your Cart
        </h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        {!loading && !error && successMsg && (
          <div className="mb-4 text-center text-primary">{successMsg}</div>
        )}
        <ul className="space-y-4">
          {cart.cartItem.map((item) => (
            <li
              key={item.productId._id}
              className="flex flex-col items-start justify-between space-y-4 rounded-lg border border-gray-300 p-4 shadow-md sm:flex-row sm:items-center sm:space-y-0"
            >
              <div className="flex items-center">
                <Image
                  src="/images/product/painfrei-oil.png"
                  alt={item.productId.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    {item.productId.title}
                  </h2>
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-primary dark:text-primary/90 sm:text-2xl">
                          ₹649.00
                        </p>
                        <p className="text-muted-foreground text-sm line-through">
                          ₹999.00
                        </p>
                        <span className="text-green-600 text-sm font-medium">
                          (35% off)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    className="rounded border px-2 py-1 sm:px-3 sm:py-2"
                    onClick={() =>
                      handleQuantityChange(
                        item.productId._id,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    className="w-12 rounded border text-center"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 1) {
                        handleQuantityChange(item.productId._id, value);
                      }
                    }}
                  />

                  <button
                    className="rounded border px-2 py-1 sm:px-3 sm:py-2"
                    onClick={() =>
                      handleQuantityChange(
                        item.productId._id,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 sm:text-base"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Cart Summary
          </h2>

          {/* Stylish Total Price Section */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-main  p-4 shadow-lg">
            <span className="text-lg font-semibold text-gray-800 sm:text-xl">
              Total Price:
            </span>
            <span className="text-green-600 text-2xl font-bold sm:text-3xl">
              ₹
              {cart.totalPriceAfterDiscount
                ? cart.totalPriceAfterDiscount
                : cart.totalPrice}
            </span>
          </div>
          <div className="space-y-4">
            {/* First Discount Section */}
            <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-4 shadow-md transition-all hover:shadow-lg">
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-6 w-6 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-800 sm:text-base">
                    Limited Time Discount Offer!
                  </span>
                </div>
                <button
                  onClick={handleInstagramClick}
                  disabled={instagramClicked}
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full ${
                    instagramClicked
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-br from-purple-600 to-pink-500"
                  } p-0.5 font-medium focus:outline-none focus:ring-4 focus:ring-purple-200`}
                >
                  <span
                    className={`relative rounded-full px-5 py-2.5 transition-all duration-75 ease-in ${
                      instagramClicked
                        ? "bg-primary text-white"
                        : "bg-white text-gray-900 group-hover:bg-opacity-0 group-hover:text-white"
                    }`}
                  >
                    {instagramClicked
                      ? "✓ Followed"
                      : "Follow Painfrei on Instagram"}
                  </span>
                </button>
              </div>
            </div>

            {/* Second Discount Section - Shows only after first click */}
            {instagramClicked && !secondDiscountClicked && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-fadeIn w-11/12 max-w-md rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-6 shadow-lg sm:w-full">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <svg
                      className="h-12 w-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-white">
                      Follow Us for an Extra 5% Off!
                    </h2>
                    <p className="text-sm text-white">
                      Follow our page to unlock an additional discount on your
                      order.
                    </p>
                    <button
                      onClick={handleSecondDiscount}
                      className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-6 py-3 font-medium text-purple-600 shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <span className="relative">Follow Now</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setInstagramClicked(false)}
                    className="absolute right-4 top-4 text-white hover:text-gray-300"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Success Message for Second Discount */}
            {secondDiscountClicked && (
              <div className="rounded-lg bg-main p-4 text-center text-primary">
                <p className="font-medium">
                  Extra 5% discount successfully applied! 🎉
                </p>
              </div>
            )}
          </div>

          {cart.discount > 0 && (
            <p className="pt-2 text-primary">
              Discount Applied: {cart.discount}%
            </p>
          )}
          <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 rounded border p-2"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 sm:text-base"
            >
              Apply Coupon
            </button>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full rounded bg-blue-600 p-2 text-sm text-white hover:bg-blue-700 sm:text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};
export default Cart;
