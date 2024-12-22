"use client"
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
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Painfrei Care & Wellness",
//   description: "Website for pain relief devices",
// };




// Main Home Component
export default async function Home() {
    useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      
    }
  }, []);

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
