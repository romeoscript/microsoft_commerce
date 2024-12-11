"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import HomeLayout from "@/components/layout/HomeLayout";
import { toast, ToastContainer } from "react-toastify";
import { handleGenericError } from "@/utils/errorHandler";

// Validation Schema using yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must be digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  message: yup.string().required("Message is required"),
});

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Thank you for contacting us!");
        reset(); // Clear the form after successful submission
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errMsg = handleGenericError(error);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Contact Info */}
            <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
              <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  Call To Us
                </h3>
                <p className="mb-4">We are available 24/7, 7 days a week.</p>
                <p className="mb-4 text-gray-700 font-medium">
                  Phone: +234 703 335 6847
                </p>
                <hr className="my-6 border-gray-200" />
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  Write To Us
                </h3>
                <p className="mb-4">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p className="mb-2 text-gray-700 font-medium">
                  Email: contact.euodiawholefoods@gmail.com
                </p>
                <hr className="my-6 border-gray-200" />
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  Locate Us
                </h3>
                <p className="mb-4">
                  Visit our office at the address below:
                </p>
                <p className="mb-2 text-gray-700 font-medium">
                  9, Oritshe Street,<br />
                  Obafemi Awolowo way,<br />
                  Ikeja, Lagos, Nigeria.
                </p>
              </div>
            </div>
            {/* Contact Form */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                        {...register("name")}
                        className={`w-full p-3 border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email *"
                        {...register("email")}
                        className={`w-full p-3 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone *"
                        {...register("phone")}
                        className={`w-full p-3 border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      {...register("message")}
                      rows="5"
                      className={`w-full p-3 border ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </HomeLayout>
  );
};

export default ContactUs;
