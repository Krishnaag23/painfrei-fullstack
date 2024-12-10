"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const CartComponent = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "carts/",
          { headers: { token: `${localStorage.getItem("token")}` } },
        );
        setCartItems(response.data.cart.cartItem);
        setTotalPrice(
          response.data.cart.totalPriceAfterDiscount ||
            response.data.cart.totalPrice,
        );
      } catch (err) {
        setError("Failed to load cart items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          setError("Failed to load payment gateway. Please try again later.");
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().then(() => {
      console.log("Razorpay script loaded");
    });
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}orders/razorpay/${user._id}`,
        { user },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );

      const { razorpayOrderId, amount } = response.data;
      console.log("Thisis the response data", response.data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Painfrei Shop",
        order_id: razorpayOrderId,
        handler: async (response) => {
          await verifyPayment(response, user._id);
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay SDK not loaded");
        setError("Razorpay is not available. Please try again.");
      }
    } catch (error) {
      setError("Error initiating checkout.");
      console.error(error);
    }
  };

  const verifyPayment = async (response, userId) => {
    try {
      const razorpayOrderId = response.razorpay_order_id;
      const razorpayPaymentId = response.razorpay_payment_id;
      const razorpaySignature = response.razorpay_signature;
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + `orders/verify-payment/${userId}`,
        {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      // Redirect to confirmation page or show success message
      alert("Payment Successful!");
      // Optionally redirect to orders or a confirmation page
      router.push("/");
    } catch (error) {
      setError("Payment verification failed.");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.productId._id} className="flex justify-between">
                <span>{item.productId.title}</span>
                <span>₹{item.price}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-4">Total Price: ₹{totalPrice}</h2>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-blue-600 px-4 py-2 text-white"
          >
            Checkout with Razorpay
          </button>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
