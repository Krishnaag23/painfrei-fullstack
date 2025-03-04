"use client";

import { useState, useEffect } from "react";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has previously interacted with the popup
    // const hasSeenPopup = localStorage.getItem("hasSeenInstagramPopup");

    // Set timeout for initial display
    const timeoutId = setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }, 2000);

    // Cleanup timeout if component unmounts
    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const openInstagram = () => {
    window.open(
      "https://www.instagram.com/prayasrath.ngo?igsh=ZDRkc2FyamhzeWRv",
      "_blank",
      "noopener,noreferrer",
    );
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 p-4 backdrop-blur-[2px] transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onScroll={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-md transform animate-slide-up overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Close modal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeWidth="2.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center">
            <h2
              id="modal-title"
              className="mb-3 text-2xl font-bold tracking-tight text-gray-900"
            >
              Alert!
            </h2>
            <p className="mb-8 text-gray-600">
              Unlock your exclusive discount! Follow Prayasrath Foundation on
              Instagram and stay updated with our latest pain relief solutions.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={openInstagram}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-px font-medium text-white transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              <span className="relative flex items-center space-x-2 px-6 py-3">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="font-medium">Follow on Instagram</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
