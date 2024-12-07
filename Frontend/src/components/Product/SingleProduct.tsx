import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

const SingleProduct = ({ product }: { product: Product }) => {
  const { title, image, price, category, description } = product;

  return (
    <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[37/22] w-full"
      >
        <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
          {category}
        </span>
        <Image src={image} alt={title} fill className="object-cover" />
      </Link>
      
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3>
          <Link
            href={`/product/${product.id}`}
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {title}
          </Link>
        </h3>
        
        <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          {description.substring(0, 100)}...
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">${price}</span>
          <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
