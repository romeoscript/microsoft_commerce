// components/OrdersDoughnutChart.js
"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { client } from "@/utils/sanity/client";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrdersDoughnutChart() {
  const [orderStatusData, setOrderStatusData] = useState({ labels: [], data: [], totalAmounts: [] });

  useEffect(() => {
    const fetchOrders = async () => {
      const query = `*[_type == "order"]{
        status,
        total
      }`;

      const results = await client.fetch(query);
      calculateOrderStatus(results);
    };

    fetchOrders();
  }, []);

  const calculateOrderStatus = (orders) => {
    const statusCount = {
      delivered: 0,
      pending: 0,
      rejected: 0,
    };

    const statusAmounts = {
      delivered: 0,
      pending: 0,
      rejected: 0,
    };

    // Calculate totals and count for each status
    orders.forEach((order) => {
      const status = order.status.toLowerCase();
      const totalAmount = order.total || 0;
      if (statusCount[status] !== undefined) {
        statusCount[status]++;
        statusAmounts[status] += totalAmount;
      }
    });

    const totalOrders = statusCount.delivered + statusCount.pending + statusCount.rejected;
    const percentageData = [
      ((statusCount.delivered / totalOrders) * 100).toFixed(2),
      ((statusCount.pending / totalOrders) * 100).toFixed(2),
      ((statusCount.rejected / totalOrders) * 100).toFixed(2),
    ];

    setOrderStatusData({
      labels: ["Delivered", "Pending", "Rejected"],
      data: [statusCount.delivered, statusCount.pending, statusCount.rejected],
      totalAmounts: [statusAmounts.delivered, statusAmounts.pending, statusAmounts.rejected],
      percentages: percentageData,
    });
  };

  const chartData = {
    labels: orderStatusData.labels.map(
      (label, index) =>
        `${label}: N${orderStatusData.totalAmounts[index]} (${orderStatusData.percentages[index]}%)`
    ),
    datasets: [
      {
        data: orderStatusData.data,
        backgroundColor: ["#4BB543", "#F7CB73", "#FF9494"],
        hoverBackgroundColor: ["#4BB543", "#F7CB73", "#FF9494"],
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
        text: "Order Status Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const amount = orderStatusData.totalAmounts[index];
            const percentage = orderStatusData.percentages[index];
            return `${tooltipItem.label}: N${amount} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">Order Status</h2>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}
