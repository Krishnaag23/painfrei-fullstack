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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className='bg-main bg-opacity-40 dark:bg-transparent'>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:scale-105 bg-white\">
              <div className="relative h-48 ">
                <img
                  src={product.imgCover}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate dark:text-white">{product.title}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2 dark:text-white">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-primary font-bold text-lg">
                    ₹{product.priceAfterDiscount || product.price}
                  </p>
                  
                  <button
                    className="px-8 py-3 text-base font-bold text-white duration-300 rounded-md bg-primary shadow-signUp hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
                >
                  Details
                </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ProductList;
