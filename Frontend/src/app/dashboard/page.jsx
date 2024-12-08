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
    return <div>Loading...</div>;
  }

  return (
    <div className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {updateMessage && <p className="text-green-500">{updateMessage}</p>}

      {/* Profile Information */}
      <div className="border p-4 rounded-md mb-6">
        <h2 className="text-xl mb-4">Profile Information</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="block w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="block w-full border rounded p-2"
              required
              disabled
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-sm bg-primary px-4 py-2 text-white shadow-submit duration-300 hover:bg-primary/90"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="border p-4 rounded-md mb-6">
        <h2 className="text-xl mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block mb-2">Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirm New Password:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="block w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-sm bg-primary px-4 py-2 text-white shadow-submit duration-300 hover:bg-primary/90"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="border p-4 rounded-md mb-6">
        <h2 className="text-xl mb-4">Account Actions</h2>
        <button 
          onClick={handleDelete}
          className="bg-red-600 text-white rounded px-4 py-2 mb-4"
        >
          Delete Account
        </button>
        <Link href="/dashboard/addresses" legacyBehavior>
          <a className="block bg-blue-600 text-white rounded px-4 py-2 mb-4 text-center">
            Manage Addresses
          </a>
        </Link>
        <Link href="/dashboard/wishlist" legacyBehavior>
          <a className="block bg-blue-600 text-white rounded px-4 py-2 text-center">
            View Wishlist
          </a>
        </Link>
      </div>
      
    </div>
    
  );
};

export default UserDashboard;
