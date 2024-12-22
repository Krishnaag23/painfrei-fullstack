"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Breadcrumb from "@/components/Common/Breadcrumb";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "address/", {
        headers: { token: `${localStorage.getItem("token")}`}});
      const data = await response.json();
      if (data.message === "success") {
        setAddresses(data.getAllAddresses);
      }
    } catch (error) {
      setAddressError("Failed to fetch addresses");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "address/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressForm),
      });
      const data = await response.json();
      if (data.message === "success") {
        setAddresses(data.addAddress);
        setAddressForm({
          street: "",
          city: "",
          state: "",
          pin: "",
          phone: "",
        });
      }
    } catch (error) {
      setAddressError("Failed to add address");
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "address/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ address: addressId }),
      });
      const data = await response.json();
      if (data.message === "success") {
        setAddresses(data.removeAddress);
      }
    } catch (error) {
      setAddressError("Failed to remove address");
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setUser(authUser);
    setLoading(false);
  }, [isLoggedIn, authUser, authLoading]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/users/${user._id}`, user);
      setUpdateMessage("User information updated successfully!");
      setUser(response.data.updatedUser);
    } catch (err) {
      setError("Failed to update user information.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      await axios.patch(`/api/users/${user._id}/change-password`, {
        currentPassword,
        newPassword,
      });
      setUpdateMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(
        "Failed to change password. Please check your current password.",
      );
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete(`/api/users/${user._id}`);

        alert("Account deleted successfully!");
        window.location.href = "/";
      } catch (err) {
        setError("Failed to delete account.");
      }
    }
  };
  const signOut =  () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="py-10 pb-32 pt-36 text-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Dashboard" description="" />
      <div className="relative z-10 overflow-hidden pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error && <p className="mb-4 text-red-500">{error}</p>}
          {updateMessage && (
            <p className="text-green-500 mb-4">{updateMessage}</p>
          )}

          {/* Profile Information */}
          <div className="mb-8 ">
            <div className="rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">
                Profile Information
              </h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:bg-primary/90"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="mb-8">
            <div className="rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:bg-primary/90"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
          {/* Address Management */}
          <div className="mb-8">
            <div className="rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Add New Address</h2>
              <form onSubmit={handleAddAddress}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          street: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={addressForm.pin}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, pin: e.target.value })
                      }
                      className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:bg-primary/90"
                >
                  Add Address
                </button>
              </form>

              {/* Display Existing Addresses */}
              {addresses.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">
                    Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {addresses.map((address, index) => (
                      <div key={address._id} className="rounded-lg border p-4">
                        <p>
                          <strong>Street:</strong> {address.street}
                        </p>
                        <p>
                          <strong>City:</strong> {address.city}
                        </p>
                        <p>
                          <strong>State:</strong> {address.state}
                        </p>
                        <p>
                          <strong>PIN:</strong> {address.pin}
                        </p>
                        <p>
                          <strong>Phone:</strong> {address.phone}
                        </p>
                        <button
                          onClick={() => handleRemoveAddress(address._id)}
                          className="mt-2 rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mb-8">
            <div className="rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Account Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard/wishlist"
                  className="hover:bg-yellow-600 rounded-lg bg-yellow px-4 py-2 text-white"
                >
                  View Wishlist
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                >
                  Order History
                </Link>
                <button onClick={signOut}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
