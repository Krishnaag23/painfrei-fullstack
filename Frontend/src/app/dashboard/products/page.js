"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";




const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    imgCover: null,
    images: [],
    description: "",
    price: 0,
    quantity: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const {user} = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "products/",
        );
        setProducts(response.data.getAllProducts);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imgCover") {
      setFormData({ ...formData, imgCover: files[0] });
    } else if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();

    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => productData.append(key, file));
      } else {
        productData.append(key, formData[key]);
      }
    }

    try {
      if (isEditing) {
        await axios.put(
          process.env.NEXT_PUBLIC_BACKEND_URL + `products/${currentProductId}`,
          productData,
          { headers: { token: ` ${localStorage.getItem("token")}` } },
        );
        setProducts((prev) =>
          prev.map((product) =>
            product._id === currentProductId
              ? { ...product, ...formData }
              : product,
          ),
        );
      } else {
        await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "products/",
          productData,
          { headers: { token: `${localStorage.getItem("token")}` } },
        );
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "products/",
        );
        setProducts(response.data.getAllProducts);
      }
      setFormData({
        title: "",
        imgCover: null,
        images: [],
        description: "",
        price: 0,
        quantity: 0,
      });
      setIsEditing(false);
      setCurrentProductId(null);
    } catch (err) {
      setError("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      imgCover: null,
      images: [],
      description: product.descripton,
      price: product.price,
      quantity: product.quantity,
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          process.env.NEXT_PUBLIC_BACKEND_URL + `/products/${id}`,
        );
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        setError("Failed to delete product. Only Admin Can delete!");
      }
    }
  };
  if(!user){
    return <div className="text-center text-red-500 pt-36">Please Login to Access This Page</div>
  }  

  if(user.role !== "admin"){
    return <div className="text-center text-red-500 pt-36">Only Admin Can Access This Page</div>
  }

  if (loading) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl overflow-hidden px-4 pb-16 pt-36">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Product Management
        </h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  
  

  return (
    <div className="relative z-10 mx-auto max-w-3xl overflow-hidden px-4 pb-16 pt-36">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Product Management
      </h1>
    {
        user.role === "admin" ? <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-lg border p-6 shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="mb-4">
          <label className="mb-2 block">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block">Cover Image:</label>
          <input
            type="file"
            name="imgCover"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block">Additional Images:</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2"
            min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2"
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form> :  <></>
    }
      

      <h2 className="mb-4 text-xl font-semibold">Existing Products</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex items-center justify-between rounded-lg border border-gray-300 p-4"
          >
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <div className="flex items-center space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
