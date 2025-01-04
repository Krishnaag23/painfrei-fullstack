"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Painfrei?",
    answer:
      "Painfrei is a startup that deals with innovative pain relief solution that combines modern technology with traditional Ayurvedic principles. We specialize in providing natural, targeted relief for various types of pain using non-invasive methods and safe, effective therapies.",
  },
  {
    question: "How does Painfrei work?",
    answer:
      "Painfrei Standard Device is the first of its kind, designed not only to relieve pain but also to aid in recovery. It employs a dual-action mechanism that integrates low TENS (Transcutaneous Electrical Nerve Stimulation) technology with Ayurvedic gel patches infused with antimicrobial properties. This combination provides targeted pain relief, stimulates natural healing processes, reduces discomfort effectively, and promotes faster recovery.",
  },

  {
    question: "Is Painfrei safe to use?",
    answer:
      "Yes, Painfrei is designed with safety as a top priority. It uses non-invasive technology and natural ingredients. However, we recommend consulting your healthcare provider before use, especially if you have pre-existing medical conditions or are taking other medications.",
  },
  {
    question: "Can Painfrei be used for all types of pain?",
    answer:
      "Painfrei is effective for a wide range of pain types, including chronic back pain, muscle cramps, and menstrual pain. For persistent or severe pain, it's best to consult a healthcare professional for a tailored treatment plan.",
  },
  {
    question: "How often can I use Painfrei?",
    answer:
      "The recommended usage of Painfrei depends on individual needs. It can generally be used daily, starting with shorter sessions and gradually increasing duration based on your comfort level and relief needs.",
  },
  {
    question: "Can I use Painfrei with other medications?",
    answer:
      "While Painfrei is non-invasive and safe, it’s advisable to consult with a medical professional if you plan to use it alongside other medications or treatments.",
  },
  {
    question: "Where can I purchase Painfrei products?",
    answer: "Painfrei products are available for pre-order on this website.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-main to-white py-16 dark:from-gray-dark dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor:
                  activeIndex === index
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0)",
              }}
              className="mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <motion.button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
