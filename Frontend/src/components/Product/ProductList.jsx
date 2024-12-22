'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/`);
        setProducts(data.getAllProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link key={product._id} href={`/product/${product._id}`}>
          <div className="border p-4 rounded hover:shadow-md transition">
            <img
              src={product.imgCover}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold">₹{product.priceAfterDiscount || product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
