// components/NewCustomerIncreaseLineChart.js
"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { client } from "@/utils/sanity/client";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function NewCustomerLineChart() {
  const [customerGrowthData, setCustomerGrowthData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchCustomerData = async () => {
      const query = `*[_type == "order"]{
        _id,
        transactionDate,
        customer->{
          _id,
          name
        }
      }`;

      const results = await client.fetch(query);
      calculateNewCustomerGrowth(results); // Calculate new customer growth
    };

    fetchCustomerData();
  }, []);

  const calculateNewCustomerGrowth = (orders) => {
    const currentYear = new Date().getFullYear();
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    const customerFirstOrder = {}; // To track the earliest order date for each customer
    const monthlyNewCustomers = {}; // To track new customers per month

    // Initialize monthly new customers count for all months
    months.forEach((month) => {
      monthlyNewCustomers[month] = 0;
    });

    // Identify the earliest order date for each customer
    orders.forEach((order) => {
      const customerId = order.customer._id;
      const orderDate = new Date(order.transactionDate);

      // If this is the first time encountering this customer or this order is earlier
      if (!customerFirstOrder[customerId] || orderDate < customerFirstOrder[customerId]) {
        customerFirstOrder[customerId] = orderDate;
      }
    });

    // Calculate the number of new customers for each month
    Object.values(customerFirstOrder).forEach((date) => {
      if (date.getFullYear() === currentYear) {
        const month = date.toLocaleString('default', { month: 'long' });
        monthlyNewCustomers[month]++;
      }
    });

    // Prepare data for the chart
    const labels = months; // All months of the year
    const data = labels.map((month) => monthlyNewCustomers[month]);

    setCustomerGrowthData({ labels, data });
  };

  const chartData = {
    labels: customerGrowthData.labels,
    datasets: [
      {
        label: "New Customers",
        data: customerGrowthData.data,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "New Customer Increase by Month",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of New Customers'
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white w-full p-6 shadow-lg rounded-lg">
      <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">New Customer Increase by Month</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
