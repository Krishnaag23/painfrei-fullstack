"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const features = featuresRef.current;

    gsap.fromTo(
      title,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      },
    );

    gsap.fromTo(
      description,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
      },
    );
    Array.from(features.children).forEach((child: HTMLElement) => {
      gsap.fromTo(
        child,
        { y: 50, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: child,
            start: "top 80%",
            end: "top 70%",
            scrub: 1,
          },
        },
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-gradient-to-b from-main to-white py-20 dark:from-gray-900 dark:to-gray-dark lg:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="mb-4 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl"
          >
            Innovative Features for Optimal Relief
          </h2>
          <p
            ref={descriptionRef}
            className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300"
          >
            Our pain relief device combines cutting-edge technology with
            Ayurvedic healing principles, offering you a comprehensive solution
            for managing discomfort and enhancing your well-being.
          </p>
        </div>

        <div
          ref={featuresRef}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuresData.map((feature) => (
            <SingleFeature key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
