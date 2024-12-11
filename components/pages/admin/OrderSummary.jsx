"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/utils/sanity/client";

export default function OrdersSummary() {
  const [orderData, setOrderData] = useState({
    totalOrdersAmount: 0,
    pendingOrdersCount: 0,
    completedOrdersAmount: 0,
    rejectedOrdersAmount: 0,
    totalOrdersGrowth: 0,
    pendingOrdersGrowth: 0,
    completedOrdersGrowth: 0,
    rejectedOrdersGrowth: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const previousMonthName = firstDayOfPreviousMonth.toLocaleString('default', { month: 'long' });
      const previousYear = firstDayOfPreviousMonth.getFullYear();

      const ordersQuery = `*[_type == "order" && transactionDate >= $firstDayOfPreviousMonth]{
        status,
        total,
        transactionDate
      }`;

      const customersQuery = `*[_type == "customer"]{_id}`;

      const [orderResults, customerResults] = await Promise.all([
        client.fetch(ordersQuery, { firstDayOfPreviousMonth: firstDayOfPreviousMonth.toISOString() }),
        client.fetch(customersQuery),
      ]);

      // Aggregate sales data for each order status
      const currentMonthOrders = orderResults.filter(
        (order) => new Date(order.transactionDate) >= firstDayOfCurrentMonth
      );
      const previousMonthOrders = orderResults.filter(
        (order) => new Date(order.transactionDate) < firstDayOfCurrentMonth
      );

      const totalOrdersAmount = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrdersCount = currentMonthOrders.filter(order => order.status === "pending").length;

      const completedOrdersAmount = currentMonthOrders
        .filter(order => order.status === "delivered")
        .reduce((sum, order) => sum + (order.total || 0), 0);
      const rejectedOrdersAmount = currentMonthOrders
        .filter(order => order.status === "rejected")
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // Calculate totals for the previous month
      const previousTotalOrdersAmount = previousMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const previousPendingOrdersCount = previousMonthOrders.filter(order => order.status === "pending").length;

      const previousCompletedOrdersAmount = previousMonthOrders
        .filter(order => order.status === "completed")
        .reduce((sum, order) => sum + (order.total || 0), 0);
      const previousRejectedOrdersAmount = previousMonthOrders
        .filter(order => order.status === "rejected")
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // Calculate growth percentages
      const pendingOrdersGrowth = calculateGrowth(pendingOrdersCount, previousPendingOrdersCount);

      const totalOrdersGrowth = calculateGrowth(totalOrdersAmount, previousTotalOrdersAmount);
      const completedOrdersGrowth = calculateGrowth(completedOrdersAmount, previousCompletedOrdersAmount);
      const rejectedOrdersGrowth = calculateGrowth(rejectedOrdersAmount, previousRejectedOrdersAmount);

      setOrderData({
        totalOrdersAmount,
        pendingOrdersCount,
        completedOrdersAmount,
        rejectedOrdersAmount,
        totalOrdersGrowth,
        pendingOrdersGrowth,
        completedOrdersGrowth,
        rejectedOrdersGrowth,
        totalCustomers: customerResults.length,
        comparisonText: `Compared to ${previousMonthName} ${previousYear}`,
      });
    };

    fetchOrders();
  }, []);

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0; // Handle division by zero
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <OrderCard
        title="Total Orders"
        amount={orderData.totalOrdersAmount}
        comparisonText={orderData.comparisonText}
        growth={orderData.totalOrdersGrowth}
      />
      <OrderCard
        title="Pending Orders"
        amount={orderData.pendingOrdersCount}
        comparisonText={""}
        growth={orderData.pendingOrdersGrowth}
      />
      <OrderCard
        title="Completed Orders"
        amount={orderData.completedOrdersAmount}
        comparisonText={orderData.comparisonText}
        growth={orderData.completedOrdersGrowth}
      />
      <OrderCard
        title="Rejected Orders"
        amount={orderData.rejectedOrdersAmount}
        comparisonText={orderData.comparisonText}
        growth={orderData.rejectedOrdersGrowth}
      />
      <OrderCard
        title="Total Customers"
        amount={orderData.totalCustomers}
        comparisonText=""
        growth={0} // No growth calculation for total customers
      />
    </div>
  );
}

function OrderCard({ title, amount, comparisonText, growth }) {
  const isGrowthPositive = growth >= 0;
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="font-bold text-md">{title}</h2>
      <div className="flex items-center mt-4">
        <div className="p-3 bg-green-500 rounded-full text-white">
          {/* Replace with your preferred icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3v18h18V3H3zm18-2a2 2 0 012 2v18a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2h18zM9 9h2v6H9V9zM13 9h2v6h-2V9z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-xl">{title === "Total Customers" || title === "Pending Orders"  ? amount : `₦${amount.toLocaleString()}`}</h3>
          {comparisonText && (
            <p className="text-gray-500 mt-1">
              <span className={`mr-1 ${isGrowthPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isGrowthPositive ? `↑ ${growth.toFixed(1)}%` : `↓ ${growth.toFixed(1)}%`}
              </span>
              {comparisonText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
