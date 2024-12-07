"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

const EditProfilePage = () => {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="overflow-hidden pb-[120px] pt-[180px]">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditProfilePage;
