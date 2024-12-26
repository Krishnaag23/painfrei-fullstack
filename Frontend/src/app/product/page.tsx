import ProductList from "@/components/Product/ProductList";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Page | Painfrei Care & Wellness",
  description: "This is the product showcase page for painfrei",
  // other metadata
};

const Product = () => {
  return (
    <>
      <Breadcrumb
        pageName=""
        description=""
      />

      <section className="pb-[120px] pt-[px] bg-main bg-opacity-40 dark:bg-transparent">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <ProductList />
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;