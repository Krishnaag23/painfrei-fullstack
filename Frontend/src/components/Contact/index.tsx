"use client";
import { useState } from "react";
import axios from "axios";
import NewsLatterBox from "./NewsLatterBox";
import toast from "react-hot-toast";
import SocialLinks from "./SocialLinks";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [valid, setValid] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors(() => ({
      ...formErrors,
      name: "",
      message: "",
      email: "",
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormErrors(() => ({ ...formErrors, name: "Name is required!" }));
      setValid(false);
    } else if (formData.name.length < 3) {
      setFormErrors(() => ({
        ...formErrors,
        name: "Name should have at least 3 characters",
      }));
      setValid(false);
    } else if (formData.name.length > 50) {
      setFormErrors(() => ({
        ...formErrors,
        name: "Name should not exceed 50 characters",
      }));
      setValid(false);
    }

    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
      setValid(false);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Please provide a valid email address";
      setValid(false);
    }

    if (!formData.message.trim()) {
      setFormErrors(() => ({ ...formErrors, message: "Message is required!" }));
      setValid(false);
    } else if (formData.message.length < 10) {
      setFormErrors(() => ({
        ...formErrors,
        message: "Messages should have at least 10 characters",
      }));
      setValid(false);
    } else if (formData.message.length > 500) {
      setFormErrors(() => ({
        ...formErrors,
        message: "Messages should not exceed 500 characters",
      }));
      setValid(false);
    }
    console.log(formErrors);

    return valid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      toast.error(
        formErrors.name
          ? formErrors.name
          : formErrors.email
            ? formErrors.email
            : formErrors.message
              ? formErrors.message
              : "Validation error",
      );

      setValid(true);
      setLoading(false);

      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}contacts/`,
        formData,
      );
      if (response.status === 201) {
        toast.success("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send your message. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="overflow-hidden bg-main  py-16 dark:bg-transparent md:py-20 lg:py-8"
    >
      <div className="container">
        <SocialLinks />
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="mb-12 rounded-sm bg-high bg-opacity-30 px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                GET IN TOUCH
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
