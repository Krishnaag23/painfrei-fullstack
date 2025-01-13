"use client";
import React from "react";
import { useRouter } from "next/navigation";

const OrderConfirmation = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-center">
          <svg
            className="text-green-500 h-16 w-16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-white">
          Order Confirmed
        </h2>
        <p className="mb-6 text-center text-lg text-gray-600 dark:text-gray-200">
          Your order has been successfully placed! You will receive an email
          with the details shortly.
        </p>
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-blue-600 px-6 py-2 text-white transition duration-300 hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
