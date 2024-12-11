"use client";
import React, { useEffect, useState } from 'react';
import Table from "@/components/reusables/table/Table";
import { client } from '@/utils/sanity/client';
import Pagination from '@/components/reusables/Pagination';
import { useRouter } from 'next/navigation';


export default function Page() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items per page
  

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

  // Calculate the index range for the current page
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  // Mapping orders to the format expected by the Table component
  const mappedOrders = currentOrders.map((order, index) => ({
    sn: index + 1,
    product: order.products?.map(product => product?.title).join(", "),
    order_id: order.orderId,
    date: new Date(order.transactionDate).toLocaleDateString(),
    name: order.customer?.name ?? "Not Available",
    status: order.status,
    amount: order.total ?? "Not Available",
    action: (
      <button
        onClick={() => handleSelectOrder(order)}
        className="text-blue-500 underline"
      >
        View Details
      </button>
    ),
  }));

  // Handle selecting an order
  const handleSelectOrder = (order) => {
    router.push(`/admin/orders/${order.orderId}`);

  };
 
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
    {
      title: "Action",
      key: "action",
      render: (data) => <span>{data.action}</span>,
    },
  ];

  return (
    <section className="p-4 my-6 flex">
      <div className="shadow-lg p-2 flex-grow">
        <h2 className="font-bold text-lg border-b-2 py-4 px-2 mb-3">All Orders</h2>
        <Table columns={customerColumn} data={mappedOrders} isGray={false} />
        <div className="my-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
     
    </section>
  );

}
