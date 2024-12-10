"use client"
import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

const CheckoutComponent = () => {

  const {user, isLoggedIn} = useAuth();


  const [shippingAddress, setShippingAddress] = useState({ name: '', address: '', city: '', state: '', zip: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const cartId = user._id; 
      // console.log("Hello this is part of debugging" + process.env.NEXT_PUBLIC_BACKEND_URL + `orders/${cartId}`, { shippingAddress })
      await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + `orders/${cartId}`, { shippingAddress }, {headers: { token: ` ${localStorage.getItem('token')}` }});
      
      alert("Order successful")
      setTimeout (window.location("/") ,3000); 
    } catch (err) {
      setError('Failed to create order.');
      console.error(err);
    }
  };

  if(!isLoggedIn){
    return <> Please Login To Checkout </>
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl">Shipping Details</h2>
      {error && <div className="text-red-500">{error}</div>}
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" onChange={handleChange} required />
      <input type="text" name="state" placeholder="State" onChange={handleChange} required />
      <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Place Order</button>
    </form>
  );
};

export default CheckoutComponent;
