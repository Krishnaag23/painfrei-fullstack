"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import BackgroundSVG from "./BackgroundSVG";

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;

    gsap.fromTo(
      hero,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
    );

    gsap.fromTo(
      title,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" },
    );

    gsap.fromTo(
      description,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.7, ease: "power2.out" },
    );

    gsap.fromTo(
      cta,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.9, ease: "power2.out" },
    );
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative z-10 flex h-screen items-center justify-center bg-opacity-50 bg-gradient-to-b from-main to-white pt-16 dark:from-gray-dark dark:to-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1
            ref={titleRef}
            className="hero-text-shadow mb-6 text-4xl font-bold leading-tight text-black dark:text-white sm:text-5xl md:text-6xl"
          >
            Relief, instantly with Painfrei
          </h1>
          <p
            ref={descriptionRef}
            className="mx-auto mb-12 max-w-3xl text-lg !leading-relaxed text-body-color dark:text-body-color-dark sm:text-xl md:text-2xl"
          >
            Bringing you our optimized formula for pain relief, wherever,
            whenever.
          </p>
          <div ref={ctaRef}>
            <Link
              href="/product"
              className="hero-button-glow inline-block rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-primary/80 hover:shadow-lg"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
      <BackgroundSVG />
    </section>
  );
};

export default Hero;
