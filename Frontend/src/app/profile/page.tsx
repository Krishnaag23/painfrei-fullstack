"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const ProfilePage = () => {
  const { isLoggedIn,user,loading } = useAuth();

  function signOut() {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  }
  
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl">Please sign in to view your profile.</h1>
        <Link href="/signin" className="mt-4 text-primary underline">
          Sign In
        </Link>
      </div>
    );
  }
  if (loading)  return <p>Loading...</p>;

  return (
    <>
      <section className="overflow-hidden pb-[120px] pt-[180px]">
        <div className="container">
          {/* Profile Container */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-6">User Profile</h1>
            
            {/* Profile Information */}
            <div className="border-b border-body-color border-opacity-10 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">Profile Information</h2>
              <p className="text-base text-body-color dark:text-body-color-dark mt-2">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-base text-body-color dark:text-body-color-dark mt-2">
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            {/* Account Actions */}
            <div className="border-b border-body-color border-opacity-10 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">Account Actions</h2>
              <Link href="/orders" className="block mt-4 text-primary hover:underline">
                View Orders
              </Link>
              <Link href="/settings" className="block mt-2 text-primary hover:underline">
                Edit Profile
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="flex justify-end">
              <button onClick={() => signOut()} 
                
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700 transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
