// components/ProfitBarChart.js
"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { client } from "@/utils/sanity/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProfitBarChart() {
  const [profitData, setProfitData] = useState({ labels: [], delivered: [], pending: [] });

  useEffect(() => {
    const fetchOrders = async () => {
      const query = `*[_type == "order" && (status == "delivered" || status == "pending")]{
        _id,
        total,
        transactionDate,
        status
      }`;

      const results = await client.fetch(query);
      calculateMonthlyData(results); // Calculate monthly data for the chart
    };

    fetchOrders();
  }, []);

  const calculateMonthlyData = (orders) => {
    // Initialize data storage for all months of the year
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthlyData = {};

    // Initialize monthly data for all months
    months.forEach((month) => {
      monthlyData[month] = { delivered: 0, pending: 0 };
    });

    // Loop through each order and group by month
    orders.forEach((order) => {
      const date = new Date(order.transactionDate);
      const month = date.toLocaleString('default', { month: 'long' });

      // Add order total to the appropriate status for that month
      if (order.status.toLowerCase() === 'delivered') {
        monthlyData[month].delivered += order.total;
      } else if (order.status.toLowerCase() === 'pending') {
        monthlyData[month].pending += order.total;
      }
    });

    // Prepare data for the chart
    const labels = months; // All months of the year
    const deliveredData = labels.map((month) => monthlyData[month].delivered);
    const pendingData = labels.map((month) => monthlyData[month].pending);

    setProfitData({ labels, delivered: deliveredData, pending: pendingData });
  };

  const chartData = {
    labels: profitData.labels,
    datasets: [
      {
        label: "Delivered Orders",
        data: profitData.delivered,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barPercentage: 0.4,
      },
      {
        label: "Pending Orders",
        data: profitData.pending,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        barPercentage: 0.4,
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
        text: "Delivered and Pending Orders by Month",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: 'Amount (N)'
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">Delivered and Pending Orders by Month</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
