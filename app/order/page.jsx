"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FcNext, FcPrevious } from "react-icons/fc";
import { client } from "@/utils/sanity/client";
import OrderTable from "@/components/OrderTable";
import HomeLayout from "@/components/layout/HomeLayout";
import OrderDetailsModal from "@/components/reusables/modal/OrderDetailsModal";

export default function OrdersPage({ searchParams }) {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page) || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the selected order details

  useEffect(() => {
    // Function to get a specific cookie by name
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Get the user ID from the cookie
    const userCookie = getCookie("euodia_user");
    if (userCookie) {
      const user = userCookie;
      setUserId(user);
    }

    // Fetch transactions if userId is available
    if (userId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const skip = (currentPage - 1) * 10; // Assuming pageSize is 10
          const transactionsData = await client.fetch(`
            *[_type == "transaction" && userId._ref == "${userId}"] | order(_createdAt desc) [${skip}...${skip + 9}] {
              _id,
              amount,
              status,
              transactionRef,
              transactionDate,
              order,
              userId
            }
          `);

          const totalTransactions = await client.fetch(`
            count(*[_type == "transaction" && userId._ref == "${userId}"])
          `);

          setTransactions(transactionsData);
          setTotalPages(Math.ceil(totalTransactions / 10));
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [userId, currentPage]);

  const handleViewTransaction = async (orderId) => {
    try {
      // Fetch more details of the selected order
      const orderDetails = await client.fetch(`
        *[_type == "order" && transactionRef == "${orderId}"] {
          _id,
          total,
          products[]->{
            title,
            price,
            quantity,
            "imageUrl": image.asset->url 

          },
          serviceFee,
          email,
          name,
          streetAddress,
          apartment,
          townCity,
          phone,
          transactionRef,
          notes,
          customer->{
            name,
            email
          }
        }
      `);
      setSelectedOrder(orderDetails[0]); // Assuming the query returns an array
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <HomeLayout>

    <div className="xl:px-[50px]">
      <h1 className="text-center font-bold text-2xl my-8">All Transactions</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : transactions?.length === 0 ? (
        <p>No transactions available</p>
      ) : (
        <>
          <OrderTable transactions={transactions}
        onViewTransaction={handleViewTransaction}
/>
          <div className="flex justify-center items-center mt-8 gap-4">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)} className="text-xl">
                <FcPrevious />
              </button>
            )}
            <span className={"text-xl"}>{currentPage}</span>

            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)} className="text-xl">
                <FcNext />
              </button>
            )}
          </div>
        </>
      )}

        {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)} // Close the modal
            />
          )}
    </div>
    </HomeLayout>
  );
}
