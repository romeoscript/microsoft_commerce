"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { client } from '@/utils/sanity/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fetch dishes from Sanity
async function getDishes() {
  const query = `*[_type == "bestSellingDish" && !(_id in path("drafts.*"))] | order(sortOrder asc) {
    _id,
    title,
    image,
    description
  }`;

  const dishes = await client.fetch(query);
  return dishes;
}

// Main BestSellerDishes Component
const BestSellerDishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const fetchedDishes = await getDishes();
        setDishes(fetchedDishes);
      } catch (error) {
        toast.error("Failed to load dishes", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchDishes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <motion.div
      className="py-16 bg-gradient-to-b from-gray-100 to-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Popular Dishes</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our top-selling dishes, crafted with the freshest ingredients and bursting with rich flavors. Every dish is a feast for the senses.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <motion.div
                key={dish._id}
                className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative h-56">
                  <Image
                    src={dish.image.asset.url}
                    alt={dish.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                    {dish.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {dish.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full">No dishes available at the moment.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default BestSellerDishes;
