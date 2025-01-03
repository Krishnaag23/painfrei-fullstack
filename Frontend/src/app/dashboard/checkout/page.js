"use client";

import CheckoutForm from "@/components/Checkout/CheckoutForm";
import OrderSummary from "@/components/Checkout/OrderSummary";
import Breadcrumb from "@/components/Common/Breadcrumb";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <Breadcrumb
        pageName="Checkout"
        description="Complete your purchase by filling in the form and reviewing your order details."
      />

      {/* Main content */}
      {/* <div className="mx-auto max-w-7xl px-4 pb-32 sm:px-6 lg:px-8"> */}
        {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-2"> */}
          {/* Checkout Form */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <CheckoutForm />
          </div>

          {/* Order Summary */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <OrderSummary />
          </div> */}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
}
