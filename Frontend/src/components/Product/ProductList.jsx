"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}products/`,
        );
        setProducts(data.getAllProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-main bg-opacity-40 dark:bg-transparent">
      <div className="container mx-auto p-6">
        <h1 className="mb-8 text-center text-2xl font-bold">Our Products</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="bg-white\ group transform overflow-hidden rounded-lg border shadow-sm transition-transform hover:scale-105 hover:shadow-md">
                <div className="relative h-48 ">
                  <Image
                    src={product.imgCover}
                    alt={product.title}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </div>
                <div className="p-4">
                  <h2 className="truncate text-lg font-semibold text-gray-800 dark:text-white">
                    {product.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-white">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">
                      ₹{product.priceAfterDiscount || product.price}
                    </p>

                    <button className="rounded-md bg-primary px-8 py-3 text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9">
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
