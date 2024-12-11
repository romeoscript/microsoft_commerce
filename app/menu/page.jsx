"use client";
import HomeLayout from '@/components/layout/HomeLayout';
import Dishes from '@/components/menu-components/Dishes';
import Category from '@/components/reusables/category/page';
import React, { useEffect, useState } from 'react';
import { client } from '@/utils/sanity/client';
import Pagination from '@/components/reusables/Pagination';

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function getDishes() {
      try {
        const query = `*[_type == "dish" && status == true && !(_id in path("drafts.*"))] | order(sortOrder asc) {
          _id,
          title,
          description,
          price,
          category->{
            _id,
            title,
          },
          image {
            asset->{
              url
            }
          }
        }`;
        const result = await client.fetch(query);


        // Extract unique categories from the fetched dishes
        const uniqueCategories = Array.from(new Set(result.map(dish => dish.category._id)))
          .map(id => {
            return result.find(dish => dish.category._id === id).category;
          });

        setCategories(uniqueCategories);

        // Automatically select the first category on load
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0].title);
        }
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    }
    getDishes();
  }, []);

  const handleCategorySelect = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
  };
  


  return (
    <HomeLayout>
      <div className='bg-white min-h-screen border border-t-2'>
        <h1 className="text-center font-bold text-4xl text-green-600 mb-5 pt-5">
          Menu
        </h1>
        <div className='container mx-auto'>
          <Category onCategorySelect={handleCategorySelect} categories={categories} />
        </div>
        <Dishes selectedCategory={selectedCategory}  />

      
      </div>
    </HomeLayout>
  );
}
