'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/solid';
import { toast } from 'react-hot-toast';

const ProductPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userReview, setUserReview] = useState({ text: '', rate: 5 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}products/${params.id}`
        );
        setProduct(data.getSpecificProduct);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}carts/`, {
        productId: params.id,
        quantity
      }, {headers: {token: `${localStorage.getItem('token')}`}});
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}review/`, {
        productId: params.id,
        ...userReview
      },{headers : {token : `${localStorage.getItem("token")}`}});
      toast.success('Review added successfully');
      setUserReview({ text: '', rate: 5 });
      // Refresh product data to show new review
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}products/${params.id}`
      );
      setProduct(data.getSpecificProduct);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-36 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-36">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="/" className="hover:text-primary dark:hover:text-primary/90">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-primary dark:hover:text-primary/90">Products</a></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-gray-100 font-medium">{product.title}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="bg-main dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full rounded-xl overflow-hidden">
                <img
                  src={product.images[selectedImage] || product.imgCover}
                  alt={product.title}
                  className="w-full h-[400px] sm:h-[500px] object-cover transform transition-transform hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative rounded-lg overflow-hidden transition-all
                      ${selectedImage === idx 
                        ? 'ring-2 ring-primary dark:ring-primary/90 transform scale-105' 
                        : 'hover:ring-2 hover:ring-primary/90 dark:hover:ring-blue-300'}`}
                  >
                    <img
                      src={image}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-20 sm:h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {product.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary dark:text-primary/90">
                      ₹{product.priceAfterDiscount || product.price}
                    </p>
                    {product.priceAfterDiscount && (
                      <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ₹{product.price}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stock Status</p>
                    <p className={`font-medium ${
                      product.quantity > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity:
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="rounded-md border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               py-2 px-4 focus:ring-primary focus:border-primary 
                               dark:focus:ring-primary/90 dark:focus:border-primary/90"
                    >
                      {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.quantity === 0}
                  className="w-full py-4 px-8 rounded-xl bg-primary dark:bg-primary 
                           text-white font-medium hover:bg-primary/90 dark:hover:bg-primary 
                           focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary/80
                           disabled:bg-gray-300 dark:disabled:bg-gray-600 
                           disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-main dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Customer Reviews</h2>

          <div className="space-y-6">
            {product.reviews?.length > 0 ? (
              product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{review.userId.name}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, idx) => (
                        <StarIcon
                          key={idx}
                          className={`h-5 w-5 ${
                            idx < review.rate 
                              ? 'text-yellow-400 dark:text-yellow-300' 
                              : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">{review.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
          
          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="mb-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Write a Review
              </label>
              <textarea
                value={userReview.text}
                onChange={(e) => setUserReview(prev => ({...prev, text: e.target.value}))}
                className="w-full rounded-xl border-high  dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-primary focus:border-primary 
                         dark:focus:ring-primary/90 dark:focus:border-primary/90"
                rows={4}
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <select
                  value={userReview.rate}
                  onChange={(e) => setUserReview(prev => ({...prev, rate: Number(e.target.value)}))}
                  className="rounded-xl border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           py-2 px-4 focus:ring-primary focus:border-primary 
                           dark:focus:ring-primary/90 dark:focus:border-primary/90"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Stars
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-3 bg-primary dark:bg-primary 
                         text-white font-medium rounded-xl
                         hover:bg-primary/90 dark:hover:bg-primary 
                         focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary/80
                         transition-all transform active:scale-95"
              >
                Submit Review
              </button>
            </div>
          </form>

          {/* Reviews List */}
          
        </div>
      </div>
    </div>
  );
};


export default ProductPage; 