"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, MessageCircle, ShoppingCart, Tag, Star } from 'lucide-react';

const softwareProducts = [
  {
    id: 1,
    title: "Office Home & Business 2019 for MAC",
    subtitle: "Bind Lifetime License Instant Delivery",
    image: "https://www.esoftwares.shop/images/blog1.jpg",
    category: ["Office", "MAC"],
    rating: 5,
    price: "$149.99",
    discount: "45% OFF"
  },
  {
    id: 2,
    title: "Project Professional 2021",
    subtitle: "Online Activation Lifetime License",
    image: "https://www.esoftwares.shop/images/seller3.jpg",
    category: ["Office", "Windows"],
    rating: 5,
    price: "$199.99",
    discount: "30% OFF"
  },
  {
    id: 3,
    title: "SQL Server 2022 Standard",
    subtitle: "License key Online Activation Instant Email Delivery",
    image: "https://www.esoftwares.shop/images/seller2.jpg",
    category: ["Server", "Database"],
    rating: 5,
    price: "$899.99",
    discount: "20% OFF"
  }
];

const TopProducts = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-gray-600">Premium software licenses with instant delivery</p>
          </div>
          <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            View All Products →
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {softwareProducts.map((product) => (
            <motion.div
              key={product.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredId(product.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {/* Product Image Container */}
              <div className="relative h-64 p-4 bg-gray-50 rounded-t-xl">
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {product.discount}
                  </span>
                </div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                {/* Categories */}
                <div className="flex gap-2 mb-3">
                  {product.category.map((cat, index) => (
                    <span key={index} className="inline-flex items-center text-xs font-medium text-gray-600">
                      <Tag size={12} className="mr-1" />
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {product.subtitle}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(product.rating)].map((_, index) => (
                    <Star key={index} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.rating}.0)</span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">{product.price}</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Heart size={18} className="text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ShoppingCart size={18} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            View All Products →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopProducts;