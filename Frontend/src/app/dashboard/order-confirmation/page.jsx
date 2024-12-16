"use client"
import React from "react";
import { useRouter } from "next/navigation";

const OrderConfirmation = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="h-16 w-16 text-green-500"
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
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          Order Confirmed
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center mb-6">
          Your order has been successfully placed! You will receive an email with the details shortly.
        </p>
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
