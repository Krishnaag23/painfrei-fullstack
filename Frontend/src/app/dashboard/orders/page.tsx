"use client";

import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";

const OrdersPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}orders/`, {
        headers: { Token: `${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "success") {
            setOrders(data.order ? [data.order] : []);
          } else {
            setError("Failed to fetch orders.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong. Please try again.");
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          Please sign in to view your orders.
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Loading orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <>
    <Breadcrumb pageName=" Your Orders" description="" />
    <section className="bg-main bg-opacity-40 dark:bg-transparent">
      <div className="container mx-auto px-4 pt-20 pb-16">
        {orders.length === 0 ? (
          <p className="text-lg text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-high/40 dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Order Details
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                  {/* <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {order.paymentStatus}
                  </p> */}
                  {/* <p>
                    <strong>Delivery Status:</strong>{" "}
                    {order.isDelivered ? "Delivered" : "Not Delivered"}
                  </p> */}
                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`}
                  </p>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-700">
                  Cart Items
                </h3>
                <ul className="mt-2 space-y-2">
                  {order.cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">
                          {item.productId.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-800 font-semibold">
                        ₹{item.price}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default OrdersPage;
