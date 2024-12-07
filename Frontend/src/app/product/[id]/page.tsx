import productData from "@/data/products.json";
import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  return productData.products.map((product) => ({
    id: product.id.toString(),
  }));
}

const ProductDetails = ({ params }: { params: { id: string } }) => {
  const product = productData.products.find(
    (p) => p.id.toString() === params.id
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductClient product={product} />;
};

export default ProductDetails;
