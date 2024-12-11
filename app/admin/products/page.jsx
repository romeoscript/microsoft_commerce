"use client";
import React, { useState } from "react";
import useSWR from "swr";
import CreateMealModal from "@/components/reusables/modal/CreateMealModal";
import ProductCard from "@/components/card/ProductCard";
import Button from "@/components/reusables/buttons/Button";
import Image from "next/image";
import Typography from "@/components/reusables/typography/Typography";
import CreateCategoryModal from "@/components/reusables/modal/CreateCategoryModal";
import { client } from "@/utils/sanity/client";
import Pagination from "@/components/reusables/Pagination";

// Fetch function for SWR
const fetcher = async (query) => {
  return await client.fetch(query);
};

// Fetch categories using SWR
const useCategories = () => {
  const { data, error } = useSWR(`*[_type == "category"]`, fetcher);
  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
  };
};

// Fetch products using SWR
const useProducts = () => {
  const { data, error, mutate } = useSWR(
    `*[_type == "dish" && !(_id in path("drafts.*"))] | order(sortOrder asc) {
      _id,
      title,
      slug,
      description,
      price,
      category->{
        title,
        _id
      },
      status,
      sortOrder,
      image {
        asset->{
          url
        }
      }
    }`,
    fetcher
  );
  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default function Page() {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productStatus, setProductStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 12; // Define the number of items per page

  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const { products, isLoading: productsLoading, isError: productsError, mutate } = useProducts();

  // Filter out duplicate category names
  const uniqueCategories = categories?.reduce((acc, category) => {
    if (!acc.find((cat) => cat.title.toLowerCase() === category.title.toLowerCase())) {
      acc.push(category);
    }
    return acc;
  }, []);

  const filteredProducts = products
    ?.filter((product) => {
      if (selectedCategory !== "All" && product.category?.title !== selectedCategory) {
        return false;
      }
      if (productStatus === "Active" && product.status !== true) {
        return false;
      }
      if (productStatus === "Inactive" && product.status !== false) {
        return false;
      }
      return true;
    });

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage); // Calculate total number of pages

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the range of products to display based on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts?.slice(startIndex, endIndex);

  return (
    <section className="p-4">
      <div className="flex flex-col md:flex-row w-full justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <Typography variant="h2" size="lg">
            All Products
          </Typography>
          <nav className="flex" aria-label="Breadcrumb">
            {/* Breadcrumb Navigation */}
          </nav>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsMealModalOpen(true)} title="Add new Product" icon={<Image src={"/prod.svg"} height={20} width={20} alt="" />} />
          <Button onClick={() => setIsCategoryModalOpen(true)} title="Add Category" icon={<Image src={"/category.svg"} height={20} width={20} alt="" />} />
        </div>
      </div>

      {/* Category and Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className={`px-4 py-2 ${selectedCategory === "All" ? "bg-green-500 text-white" : "capitalize"}`} onClick={() => setSelectedCategory("All")}>
          All
        </button>
        {uniqueCategories?.map((category) => (
          <button
            key={category._id}
            className={`px-4 py-2 capitalize ${selectedCategory === category.title ? "bg-green-500 border-b py-2 text-white" : "border-b "}`}
            onClick={() => setSelectedCategory(category.title)}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Product Status Filter */}
      <div className="mb-6">
        <select className="px-4 py-2 rounded-lg bg-gray-200" value={productStatus} onChange={(e) => setProductStatus(e.target.value)}>
          <option value="All">All Products</option>
          <option value="Active">Active Products</option>
          <option value="Inactive">Inactive Products</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedProducts?.map((product) => (
          <ProductCard key={product._id} product={product} mutate={mutate} />
        ))}
      </div>

      {/* Pagination Component */}
      <div className="my-6 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Modals */}
      <CreateMealModal isOpen={isMealModalOpen} onClose={() => setIsMealModalOpen(false)} categories={categories} ingredients={[]} mutate={mutate} />
      <CreateCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </section>
  );
}
