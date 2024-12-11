"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/utils/sanity/client";
import { toast } from "react-toastify";
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const formatCurrency = useCurrencyFormatter();

  useEffect(() => {
    const fetchBestSellers = async () => {
      const query = `*[_type == "order"]{
        products[]->{
          _id,
          title,
          image {
            asset->{
            _id,
              url
            }
          }, 
          price
        }
      }`;

      const results = await client.fetch(query);
console.log(results)
      // Aggregate sales data for each dish
      const dishSales = {};
      results?.forEach((order) => {
        order.products?.forEach((dish) => {
          const dishPrice = Number(dish?.price || 0); // Convert price to number
          if (dishSales[dish?._id]) {
            dishSales[dish?._id].total_sales += 1;
            dishSales[dish?._id].total_amount += dishPrice;
          } else {
            dishSales[dish?._id] = {
              id: dish?._id,
              meal: dish?.title,
              img: dish?.image,
              total_sales: 1,
              total_amount: dishPrice,
            };
          }
        });
      });

      // Convert the sales object to an array and sort by total sales
      const sortedBestSellers = Object.values(dishSales).sort(
        (a, b) => b.total_sales - a.total_sales
      );

      setBestSellers(sortedBestSellers);
    };

    fetchBestSellers();
  }, []);

  // Function to check if a dish already exists in Best Selling Dishes
  const checkIfExists = async (meal) => {
    const query = `*[_type == "bestSellingDish" && title == $title]{
      _id
    }`;
    const params = { title: meal.meal };
    const existingDish = await client.fetch(query, params);
    return existingDish.length > 0;
  };

  // Function to add a dish to the Best Selling Dishes document
  const addToBestSellers = async (meal) => {
    const exists = await checkIfExists(meal);
console.log(meal);

    if (exists) {
      toast.error(`${meal.meal} is already in Best Selling Dishes.`);
      return;
    }

    const newBestSeller = {
      _type: "bestSellingDish",
      title: meal.meal,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: meal.img.asset._id  // Assuming meal.img.asset._id is where the asset ID is stored
        }
      },
      total_sales: meal.total_sales,
      total_amount: meal.total_amount,
      isActive: true,

    };

    try {
      await client.create(newBestSeller);
      toast.success(`${meal.meal} has been added to Best Selling Dishes.`);
    } catch (error) {
      console.error("Error adding dish to Best Selling Dishes:", error);
      toast.error("Failed to add dish to Best Selling Dishes.");
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg max-h-[500px] overflow-y-auto">
      <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">
        Best Sellers Dishes
      </h2>
      <div className=" flex items-center justify-start flex-wrap gap-6">
        {bestSellers?.length === 0 && <div>No available content</div>}
        {bestSellers?.slice(0, 4).map((meal) => (
          <div
            key={meal.id}
            className="flex justify-between items-center border shadow-xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-[130px] h-[130px]">
                <Image
                  src={meal.img?.asset.url}
                  alt={meal.meal}
                  width={80}
                  height={80}
                  className="rounded-2xl w-full object-cover aspect-square"
                />
              </div>
              <div>
                <h2 className="font-bold">{meal.meal}</h2>
                <p className="text-gray-500">{meal.total_sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-bold">{formatCurrency(meal.total_amount)}</h2>
              <p className="text-gray-500">{meal.total_sales} sales</p>
              <button
                onClick={() => addToBestSellers(meal)}
                className="mt-2 text-green-500 "
              >
                Add to Best Sellers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
