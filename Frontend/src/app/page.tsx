import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";
import Products from "@/components/Product/Products";
import { Product } from "@/types/product";
import ProductList from "@/components/Product/ProductList";

export const metadata: Metadata = {
  title: "Painfrei Care & Wellness",
  description: "Website for pain relief devices",
};

// Utility function to fetch products
async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/`);

    // Check if the response is OK
    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.statusText}`);
      return [];
    }

    const data: any = await response.json();
    const productarray : Product[] = data.getAllProducts;
    
    // console.log(productarray)
    if (!Array.isArray(productarray)) {
      console.error("Fetched products data is not an array.");
      return [];
    }

    return productarray;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Main Home Component
export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <ScrollUp />
      <Hero />
      <Video />
      <Features />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <ProductList />
      {/* <Products products={products} /> */}
      <div id="contact">
        <Contact />
      </div>
    </>
  );
}
