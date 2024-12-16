"use client";


import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const {user, isLoggedIn} = useAuth();  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    if (isLoggedIn) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `orders?userId=${user._id}`, {headers: {Token: `${localStorage.getItem('token')}`}})
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl">Please sign in to view your orders.</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl">Loading orders...</h1>
      </div>
    );
  }

  return (
    <section className="overflow-hidden pb-[120px] pt-[180px]">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-lg text-gray-600">No orders found.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id.toString()}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <p>
                  <strong>Order ID:</strong> {order.id.toString()}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.totalAmount}
                </p>
                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {order.address.street}, {order.address.city}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;
