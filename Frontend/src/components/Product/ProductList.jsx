"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

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
        <motion.div
          className="h-12 w-12 rounded-full border-t-4 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-main py-20 dark:from-gray-900 dark:to-gray-dark">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Our Products
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/product/${product._id}`}>
                {product._id === "675596a8f4f20366005ce1e1" ? (
                  <>
                    <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/images/product/painfrei-oil.png"
                          alt={product.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                          Pain Relief Oil
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                          Experience the soothing properties of Painfrei Pain
                          Relief Oil, meticulously crafted to provide effective
                          relief from various aches and discomforts. Infused
                          with a unique blend of modern and Ayurvedic
                          ingredients, our oil harnesses the healing power of
                          nature to promote wellness and restore balance in your
                          life.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xl font-bold text-primary dark:text-primary/90 sm:text-2xl">
                                  ₹649.00
                                </p>
                                <p className="text-muted-foreground text-sm line-through">
                                  ₹999.00
                                </p>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hover:bg-primary-dark rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-300"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src="/images/product/painfrei-device.png"
                          alt={product.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                          Painfrei Device
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                          Experience the future of pain relief with our upcoming
                          Painfrei Device. Designed with cutting-edge technology
                          and innovative features, this device aims to provide
                          effective and convenient pain management
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ₹4000.00
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hover:bg-primary-dark rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-300"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </div> */}
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
