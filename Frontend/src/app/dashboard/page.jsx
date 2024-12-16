"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import axios from "axios"; 
import useAuth from "@/hooks/useAuth";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();

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
      setError("Failed to change password. Please check your current password.");
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


 if (loading) {
    return <div className="text-center py-10 pt-36 pb-32 text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="relative z-10 overflow-hidden pb-32 pt-36 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">User Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {updateMessage && <p className="text-green-500 mb-4">{updateMessage}</p>}

        {/* Profile Information */}
        <div className="mb-8 ">
          <div className="border rounded-lg bg-white shadow-lg dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border rounded-lg p-2 bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 shadow-md"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-8">
          <div className="border rounded-lg bg-white shadow-lg dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 shadow-md"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mb-8">
          <div className="border rounded-lg bg-white shadow-lg dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <div className="flex flex-wrap gap-4">
              {/* <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button> */}
              <Link
                href="/dashboard/addresses"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Manage Addresses
              </Link>
              <Link
                href="/dashboard/wishlist"
                className="bg-yellow text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
              >
                View Wishlist
              </Link>
              <Link
                href="/dashboard/orders"
                className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600"
              >
                Order History
              </Link>
              {/* <Link
                href="/dashboard/activity"
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
              >
                View Activity Logs
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 