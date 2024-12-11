"use client";
import "../globals.css";

import Table from "@/components/reusables/table/Table";
import BestSellers from "@/components/pages/admin/BestSellers";
import OrdersSummary from "@/components/pages/admin/OrderSummary";
import { useEffect, useState } from "react";
import { client } from "@/utils/sanity/client";
import TopCustomers from "@/components/pages/admin/TopCustomers";
import ProfitBarChart from "@/components/charts/ProfitBarChart";
import OrdersDoughnutChart from "@/components/charts/OrdersDoughnutChart";
import NewCustomerLineChart from "@/components/charts/NewCustomerLineChart";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const query = `*[_type == "order"]{
        _id,
        orderId,
        total,
        status,
        transactionDate,
        transactionRef,
        customer->{
          _id,
          name,
          email,
          orderCount,
          totalSpent,
          orders[]->{
            _id,
            orderId,
            transactionDate,
            total
          },
          transactions[]->{
            _id,
            transactionRef,
            amount,
            date
          }
        },
        products[]->{
          _id,
          title,
          price
        },
        name,
        streetAddress,
        apartment,
        townCity,
        phone,
        email,
        serviceFee->{
          _id,
          fee
        },
        notes
      }`;

      const results = await client.fetch(query);
      setOrders(results);
    };

    fetchOrders();
  }, []);
  const mappedOrders = orders
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)) // Sort orders by transactionDate in descending order
    .slice(0, 10) // Take the top 10 recent orders
    .map((order, index) => ({
      sn: index + 1,
      product: order.products?.map((product) => product?.title).join(", "),
      order_id: order.orderId,
      date: new Date(order.transactionDate).toLocaleDateString(),
      name: order.customer?.name ?? "Not Available",
      status: order.status ?? "Not Available",
      amount: order.total ?? "Not Available",
    }));

  const customerColumn = [
    {
      title: "S/N",
      key: "sn",
      render: (data) => <span>{data.sn}</span>,
    },
    {
      title: "Product",
      key: "product",
      render: (data) => <span>{data.product}</span>,
    },
    {
      title: "Order ID",
      key: "order_id",
      render: (data) => <span>{data.order_id}</span>,
    },
    {
      title: "Date",
      key: "date",
      render: (data) => <span>{data.date ?? "Not Available"}</span>,
    },
    {
      title: "Customer Name",
      key: "customer_name",
      render: (data) => <span>{data.name ?? "Not Available"}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (data) => {
        const status = data?.status?.toLowerCase();
        const statusStyles = {
          delivered: { background: "#4BB543", color: "white" },
          cancelled: { background: "#FF9494", color: "white" },
          pending: { background: "#F7CB73", color: "black" },
        };
        const style = statusStyles[status] || {};
        return (
          <span
            style={style}
            className={`py-2 px-4 rounded-full border ${status && `bg-${style.background}/30 border-${style.background} text-${style.color}`}`}
          >
            {data?.status}
          </span>
        );
      },
    },
    {
      title: "Amount",
      key: "amount",
      render: (data) => <span>{data.amount ?? "Not Available"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Total Orders */}
      <OrdersSummary />
      <div className="grid grid-cols-3 gap-4 ">
        <div className="flex items-center col-span-2">
          <NewCustomerLineChart />
        </div>
        <div className="col-span-1">
          <BestSellers />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 ">
        <div className="col-span-2">
          {/* Profit Chart */}
          <ProfitBarChart />
        </div>
        <div className="col-spa-1">
          {/* Orders Status Doughnut Chart */}
          <OrdersDoughnutChart />
        </div>
      </div>
      {/* Recent Orders */}
      <div className="grid grid-cols-3 gap-5">
        <div className=" col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="font-bold text-lg border-b-2 pb-4 mb-4">
            Recent Orders
          </h2>
          <Table columns={customerColumn} data={mappedOrders} isGray={false} />
        </div>
        <TopCustomers />
      </div>
    </div>
  );
}
