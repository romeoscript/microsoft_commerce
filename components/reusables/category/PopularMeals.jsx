"use client";
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { client } from '@/utils/sanity/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon

export default function PopularMeals() {
  const [bestSellers, setBestSellers] = useState([]);
  const formatCurrency = useCurrencyFormatter();

  useEffect(() => {
    const fetchBestSellers = async () => {
      const query = `*[_type == "bestSellingDish"]{
        _id,
        title,
        image {
          asset->{
            _id,
            url
          }
        },
        total_sales,
        total_amount,
        isActive
      }`;
  
      try {
        const results = await client.fetch(query);
        setBestSellers(results);
      } catch (error) {
        toast.error('Failed to load best selling dishes');
      }
    };
  
    fetchBestSellers();
  }, []);
  

  // Function to add a dish to the Best Selling Dishes document
  const addToBestSellers = async (meal) => {
BestSeller = {
      _type: 'bestSellingDish',
      title: meal.title,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: meal.img.asset._id  // Assuming meal.img.asset._id is where the asset ID is stored
        }
      },      total_sales: meal.total_sales,
      total_amount: meal.total_amount,
      isActive: true,
    };

    try {
      await client.create(newBestSeller);
      toast.success(`${meal.title} has been added to Best Selling Dishes.`);
    } catch (error) {
      toast.error('Failed to add dish to Best Selling Dishes.');
    }
  };

  const deleteFromBestSellers = async (meal) => {
    try {
      if (!meal._id) {
        toast.error('No valid identifier for the dish.');
        return;
      }
  
      // Check if the dish is already inactive, and then delete it
      if (!meal.isActive) {
        const response = await client.delete(meal._id);
        toast.success(`${meal.title} has been permanently removed from Best Selling Dishes.`);
  
        // Update local state to remove the dish entirely
        setBestSellers((prev) => prev.filter((m) => m._id !== meal._id));
      } else {
        // Optionally deactivate first before deleting if that's a requirement
        await client.patch(meal._id).set({ isActive: false }).commit();
        toast.info(`${meal.title} has been deactivated. Preparing for removal...`);
        // You can then call delete or handle it in a separate step
        const response = await client.delete(meal._id);
        toast.success(`${meal.title} has been permanently removed from Best Selling Dishes.`);
  
        // Update local state to remove the dish entirely
        setBestSellers((prev) => prev.filter((m) => m._id !== meal._id));
      }
    } catch (error) {
      toast.error('Failed to permanently delete dish from Best Selling Dishes.');
    }
  };
  
  
  
  

  return (
    <div className="grid grid-cols-4 gap-6">
    {bestSellers.length === 0 && <div>No available content</div>}
    {bestSellers.map((meal) => (
      <div key={meal._id} className="flex justify-between items-center border shadow-xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-[130px] h-[130px]">
            <Image
              src={meal?.image?.asset?.url}
              alt={meal.title}
              width={80}
              height={80}
              className="rounded-2xl w-full object-cover aspect-square"
            />
          </div>
          <div>
            <h2 className="font-bold">{meal.title}</h2>
            <p className="text-gray-500">{meal.total_sales} sales</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="font-bold">{formatCurrency(meal.total_amount)}</h2>
          <p className="text-gray-500">{meal.total_sales} sales</p>
          {meal.isActive ? (
            <button
              onClick={() => deleteFromBestSellers(meal)}
              className="mt-2 text-red-500 flex items-center gap-1"
            >
              <FaTrashAlt className="text-red-500" /> Remove
            </button>
          ) : (
            <button
              onClick={() => addToBestSellers(meal)}
              className="mt-2 text-green-500"
            >
              Add back to Best Sellers
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
  );
}
