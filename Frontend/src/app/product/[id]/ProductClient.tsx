"use client";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";

interface ProductClientProps {
  product: Product;
}
interface ProductWithQuantity extends Product {
  quantity: number;
}

const ProductClient = ({ product }: ProductClientProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (response.ok) {
        alert("Product added to cart!");
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong!");
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const res = await initializeRazorpay();
      if (!res) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      const orderData = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: product.price * quantity * 100 }),
      }).then((res) => res.json());

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Your Store",
        description: `Purchase of ${product.title}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          const verification = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }).then((res) => res.json());

          if (verification.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: { name: "", email: "", contact: "" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pb-[120px] pt-[180px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
          </div>
          <p className="text-lg">{product.description}</p>
          <div className="flex items-center space-x-4">
            <label className="text-lg font-medium">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="rounded-md border px-4 py-2"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="rounded-md bg-gray-200 px-6 py-3"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="rounded-md bg-primary px-6 py-3 text-white"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
