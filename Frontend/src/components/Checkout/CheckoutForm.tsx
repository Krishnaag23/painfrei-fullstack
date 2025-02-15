"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}
interface ShippingDetails {
  name: string;
  email: string;
}
interface OrderDetails {
  quantity: string;
  productId: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  phone: string;
  state: string;
}

interface FormData extends ShippingDetails, ShippingAddress {
  shippingMethod: "standard" | "express";
}

export default function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuth();
  const newId = uuidv4();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    street: "",
    city: "",
    phone: "",
    state: "",
    shippingMethod: "standard",
  });

  const [error, setError] = useState<string | null>(null);
  const [isDeliverable, setIsDeliverable] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        street: user.addresses[0]?.street || "",
        city: user.addresses[0]?.city || "",
        phone: user.addresses[0]?.phone || "",
        state: user.addresses[0]?.state || "",
        shippingMethod: "standard",
      });
    }
  }, [user]);
  useEffect(() => {
    const isDelivery = localStorage.getItem("isDeliverable");
    setIsDeliverable(isDelivery);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleShippingMethodChange = (value: string) => {
    setFormData({
      ...formData,
      shippingMethod: value as "standard" | "express",
    });
  };

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () =>
          reject(new Error("Failed to load Razorpay script"));
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript()
      .then(() => console.log("Razorpay script loaded"))
      .catch((error) => {
        setError("Failed to load payment gateway. Please try again later.");
        console.error(error);
      });
  }, []);

  const handlePreOrder = async () => {
    const shippingDetails: ShippingDetails = {
      name: formData.name,
      email: formData.email,
    };

    const order: OrderDetails = {
      quantity: localStorage.getItem("quantity") || "1",
      productId: localStorage.getItem("productId") || "",
    };

    const shippingAddress: ShippingAddress = {
      street: formData.street,
      city: formData.city,
      phone: formData.phone,
      state: formData.state,
    };

    try {
      // Step 1: Create Razorpay order for preorder
      const paymentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}preorder/create-payment`,
        {
          productId: order.productId,
          quantity: order.quantity,
        },
      );

      const { razorpayOrderId, amount } = paymentResponse.data;

      // Step 2: Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Painfrei Care & Wellness",
        description: "Preorder Payment for Pain Relief Oil",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on success
            console.log("Preorder payment response:", response);
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}preorder/verify-payment`,
              {
                ...response,
                shippingDetails,
                shippingAddress,
                productId: order.productId,
                quantity: order.quantity,
              },
            );

            // Step 4: Clear storage and redirect only after successful verification
            localStorage.removeItem("quantity");
            localStorage.removeItem("productId");
            router.push("/dashboard/order-confirmation");
          } catch (verificationError) {
            setError("Payment verification failed. Please contact support.");
            console.error("Verification error:", verificationError);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setError("Payment gateway unavailable. Please try again later.");
      }
    } catch (error) {
      setError("Error initiating preorder payment. Please try again.");
      console.error("Preorder payment error:", error);
    }
  };

  // Update the handleSubmit to remove redundant logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeliverable === "true") {
      handleCheckout();
    } else {
      handlePreOrder();
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast("Please login to place order.");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return;
    }
    const shippingDetails: ShippingDetails = {
      name: formData.name,
      email: formData.email,
    };

    const shippingAddress: ShippingAddress = {
      street: formData.street,
      city: formData.city,
      phone: formData.phone,
      state: formData.state,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}orders/razorpay/${user._id}`,
        { user },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );

      const { razorpayOrderId, amount } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Painfrei Care & Wellness",
        description: "Payment for your order of Pain Relief Oil",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          await verifyPayment(
            shippingDetails,
            shippingAddress,
            response,
            user._id,
          );
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setError("Razorpay is not available. Please try again.");
        console.error("Razorpay SDK not loaded");
      }
    } catch (error) {
      setError("Error initiating checkout.");
      console.error(error);
    }
  };

  const verifyPayment = async (
    shippingDetails: ShippingDetails,
    shippingAddress: ShippingAddress,
    response: any,
    userId: string,
  ) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        response;
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}orders/verify-payment/${userId}`,
        {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          shippingDetails,
          shippingAddress,
        },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      router.push("/dashboard/order-confirmation");
    } catch (error) {
      setError("Payment verification failed.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-6 rounded-lg border bg-white p-6 shadow-md dark:bg-black"
    >
      <h1 className="text-xl font-semibold">Checkout Form</h1>

      {/* Full Name */}
      <FormField
        label="Full Name"
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <FormField
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* Phone Number */}
      <FormField
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder=""
        required
        pattern="^[1-9]\d{9}$" // Pattern for Indian numbers
      />

      {/* Address */}
      <FormField
        label="Address"
        id="street"
        name="street"
        type="text"
        value={formData.street}
        onChange={handleChange}
        required
      />

      {/* City & State */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <FormField
          label="State"
          id="state"
          name="state"
          type="text"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>

      {/* Shipping Method */}
      {/* <div>
        <p className="font-medium">Shipping Method</p>
        <div className="mt-2 flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={formData.shippingMethod === "standard"}
              onChange={() => handleShippingMethodChange("standard")}
              className="form-radio"
            />
            <span>Standard Shipping (₹100)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={formData.shippingMethod === "express"}
              onChange={() => handleShippingMethodChange("express")}
              className="form-radio"
            />
            <span>Express Shipping (₹200)</span>
          </label>
        </div>
      </div> */}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        {isDeliverable === "true" ? "Place Order" : "Pre-Order"}
      </button>
    </form>
  );
}

// Reusable FormField Component
interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  title?: string;
}

function FormField({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  pattern,
  title,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-black dark:text-white"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        title={title}
        className="mt-1 w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white"
      />
    </div>
  );
}
