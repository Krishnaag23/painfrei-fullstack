"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const OrderConfirmation = () => {
  const router = useRouter();

  return (
    <section className="relative z-10 bg-main bg-opacity-60 pb-16 pt-36 dark:bg-transparent md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[530px] text-center">
              {/* Success Icon Circle */}
              <div className="mx-auto mb-9 text-center">
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary bg-opacity-10">
                  <svg
                    className="h-16 w-16 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Order Confirmed
              </h3>

              <div className="mx-auto mb-6 h-1 w-20 rounded bg-primary"></div>

              <p className="mb-8 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                Your order has been successfully placed! You will receive an
                email with the details shortly.
              </p>

              {/* Recycling Card */}
              <div className="mb-10 rounded-lg border border-primary border-opacity-20 bg-white p-6 shadow-md dark:bg-gray-800">
                <h4 className="mb-3 text-lg font-semibold text-primary dark:text-primary">
                  Recycling Reward
                </h4>
                <p className="leading-relaxed text-body-color">
                  Return your used bottles and enjoy an instant{" "}
                  <span className="font-bold text-primary">20% discount</span>{" "}
                  on your next purchase! Let&apos;s reduce waste together while
                  saving on your order.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  onClick={() => router.push("orders")}
                  className="w-full rounded-md border border-primary px-8 py-3 text-base font-medium text-primary transition duration-300 hover:border-primary hover:bg-primary hover:bg-opacity-10 sm:w-auto"
                >
                  View Orders
                </button>
                <Link
                  href="/"
                  className="w-full rounded-md bg-primary px-8 py-3 text-base font-bold text-white shadow-signUp duration-300 hover:bg-opacity-90 sm:w-auto md:px-9 lg:px-8 xl:px-9"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 left-0 z-[-1] hidden sm:block">
        <svg
          width="406"
          height="286"
          viewBox="0 0 406 286"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <rect
              opacity="0.5"
              x="56.25"
              y="110.344"
              width="116.719"
              height="116.438"
              stroke="url(#paint0_linear_116:1140)"
            />
            <rect
              opacity="0.1"
              x="56.25"
              y="110.344"
              width="116.719"
              height="116.438"
              fill="url(#paint1_linear_116:1140)"
            />
            <path
              opacity="0.5"
              d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
              stroke="url(#paint2_linear_116:1140)"
            />
            <path
              opacity="0.1"
              d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
              fill="url(#paint3_linear_116:1140)"
            />
            <path
              opacity="0.5"
              d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
              stroke="url(#paint4_linear_116:1140)"
            />
            <path
              opacity="0.1"
              d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
              fill="url(#paint5_linear_116:1140)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_116:1140"
              x1="49.0781"
              y1="112.313"
              x2="148.922"
              y2="131.859"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" stopOpacity="0" />
              <stop offset="1" stopColor="#06413C" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_116:1140"
              x1="179.141"
              y1="209.062"
              x2="32.6026"
              y2="145.47"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" />
              <stop offset="1" stopColor="#06413C" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_116:1140"
              x1="170.016"
              y1="125.25"
              x2="217.542"
              y2="125.507"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" stopOpacity="0" />
              <stop offset="1" stopColor="#06413C" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_116:1140"
              x1="233.578"
              y1="113.156"
              x2="146.509"
              y2="143.95"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" />
              <stop offset="1" stopColor="#06413C" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_116:1140"
              x1="-3.45633"
              y1="113.316"
              x2="46.311"
              y2="116.426"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" stopOpacity="0" />
              <stop offset="1" stopColor="#06413C" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_116:1140"
              x1="69.8907"
              y1="189.234"
              x2="84.0124"
              y2="249.947"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" />
              <stop offset="1" stopColor="#06413C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute right-0 top-0 z-[-1] hidden sm:block">
        <svg
          width="406"
          height="286"
          viewBox="0 0 406 286"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <rect
              opacity="0.5"
              x="229.938"
              y="49.2812"
              width="119.25"
              height="116.438"
              stroke="url(#paint6_linear_116:1151)"
            />
            <rect
              opacity="0.1"
              x="229.938"
              y="49.2812"
              width="119.25"
              height="116.438"
              fill="url(#paint7_linear_116:1151)"
            />
            <path
              opacity="0.5"
              d="M348.906 49.2812L406 0V108.113L348.906 165.719V49.2812Z"
              stroke="url(#paint8_linear_116:1151)"
            />
            <path
              opacity="0.1"
              d="M348.906 49.2812L406 0V108.113L348.906 165.719V49.2812Z"
              fill="url(#paint9_linear_116:1151)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint6_linear_116:1151"
              x1="219.953"
              y1="155.453"
              x2="331.261"
              y2="146.369"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" stopOpacity="0" />
              <stop offset="1" stopColor="#06413C" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_116:1151"
              x1="349.187"
              y1="44.6406"
              x2="281.112"
              y2="166.552"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" />
              <stop offset="1" stopColor="#06413C" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint8_linear_116:1151"
              x1="394.75"
              y1="64.3284"
              x2="409.531"
              y2="110.901"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" stopOpacity="0" />
              <stop offset="1" stopColor="#06413C" />
            </linearGradient>
            <linearGradient
              id="paint9_linear_116:1151"
              x1="410"
              y1="8.00001"
              x2="332.729"
              y2="32.2741"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06413C" />
              <stop offset="1" stopColor="#06413C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default OrderConfirmation;
