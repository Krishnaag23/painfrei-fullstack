// app/dashboard/wishlist/page.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "wishlist/", {headers: { token: ` ${localStorage.getItem('token')}` }})
      .then((response) => {
        setWishlist(response.data.getAllUserWishList);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleRemove = (productId) => {
    axios
      .delete(process.env.NEXT_PUBLIC_BACKEND_URL + `wishlist/${productId}`, {headers: { token: ` ${localStorage.getItem('token')}` }})
      .then((response) => {
        setWishlist(wishlist.filter((item) => item._id !== productId));
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  if (wishlist.length === 0){
    return <div className="container mx-auto p-4 pt-36">
        
      <h1 className="mb-4 text-3xl font-bold">Wishlist</h1><p>Nothing In the Wishlist</p></div>
  }
  return (
    <div className="container mx-auto p-4 pt-36">
      <h1 className="mb-4 text-3xl font-bold">Wishlist</h1>
      {error && <p style={{ color: "red" }}>{error }</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <div key={item._id} className="rounded bg-white p-4 shadow-md">
            <h2 className="mb-2 text-lg font-bold">{item.product.name}</h2>
            <p className="mb-2 text-gray-600">{item.product.description}</p>
            <button
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
              onClick={() => handleRemove(item.product._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
