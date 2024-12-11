"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/utils/sanity/client";
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';

export default function TopCustomers() {
  const [topCustomers, setTopCustomers] = useState([]);
  const formatCurrency = useCurrencyFormatter();

  useEffect(() => {
    const fetchTopCustomers = async () => {
      const query = `*[_type == "order"]{
        customer->{
          _id,
          name,
          isAnonymous,
          totalSpent
        },
      }`;

      const results = await client.fetch(query);

      // Aggregate sales data for each customer
      const customerSales = {};
      results?.forEach((order) => {
        const customerId = order?.customer?._id;
        const customerName = order?.customer?.name || "Anonymous";
        const isAnonymous = order?.customer?.isAnonymous || false;
        const orderAmount = Number(order?.customer.totalSpent || 0); // Convert amount to number

        if (customerSales[customerId]) {
          customerSales[customerId].total_orders += 1;
          customerSales[customerId].totalSpent;
        } else {
          customerSales[customerId] = {
            id: customerId,
            name: customerName,
            isAnonymous,
            total_orders: 1,
            total_amount: orderAmount,
          };
        }
      });

      // Convert the sales object to an array and sort by total orders
      const sortedTopCustomers = Object.values(customerSales).sort(
        (a, b) => b.total_orders - a.total_orders
      );

      setTopCustomers(sortedTopCustomers);
    };

    fetchTopCustomers();
  }, []);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg ">
      <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">
        Top Customers
      </h2>
      <div className="max-h-[400px] overflow-y-auto">

      <div className="flex items-center justify-center flex-wrap gap-6">
        {topCustomers.slice(0, 5).map((customer) => (
          <div
            key={customer.id}
            className="flex justify-between items-center border shadow-xl p-4 w-full"
          >
            <div>
              <h2 className="font-bold">{customer.name}</h2>
              <p className="text-gray-500">
                {customer.isAnonymous ?  <span className="bg-red-500 text-white p-1 rounded-full">Anonymous User </span>   : <span className="bg-green-500 text-white p-1 rounded-full">Registered User </span> }
              </p>
              <p className="text-gray-500">{customer.total_orders} orders</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold">{formatCurrency(customer.total_amount)}</h2>
              <p className="text-gray-500">{customer.total_orders} orders</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
