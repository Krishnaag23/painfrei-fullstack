import SectionTitle from "../Common/SectionTitle";
import SingleProduct from "./SingleProduct";
import { Product } from "@/types/product";


const Products = ({ products }: { products: Product[] }) => {
  return (
    <section className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Our Featured Products"
          paragraph="Discover our handpicked selection of premium products crafted for quality and performance."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <SingleProduct product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
