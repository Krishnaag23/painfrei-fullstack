import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";
import Products from "@/components/Product/Products";
import { Product } from "@/types/product";
import productsData from "@/data/products.json"

function getProducts(): Product[] {
  return productsData.products;
}

  


export const metadata: Metadata = {
  title: "Painfrei Care & Wellness",
  description: "Website for pain relief devices",
  // other metadata
};

export default function Home() {
  const products = getProducts();

  
      
  
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
      {/* <Pricing /> */}
      {/* <Blog /> */}
      <Products products={products} />
      <div id="contact">
        <Contact />
      </div>
    </>
  );
}
