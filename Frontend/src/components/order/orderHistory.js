"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'orders/', {headers:{ token : `${localStorage.getItem("token")}`} }); 
        
        const fetchedOrders = response.data.order

        if (Array.isArray(fetchedOrders)) {
          setOrders(fetchedOrders);
        } else {
          setOrders([fetchedOrders]); 
        }
        // console.log("This is the response data orders: " + response.data.order);
      } catch (err) {
        setError('Failed to load orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!orders) return <div>No orders found.</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Order History</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id} className="border p-4">
            <h2 className="font-semibold">Order ID: {order._id}</h2>
            <p>Total Price: ₹{order.totalOrderPrice}</p>
            <p>Status: {order.paymentStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
