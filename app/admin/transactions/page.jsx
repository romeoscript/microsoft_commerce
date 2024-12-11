'use client';

import React, { useState, useEffect } from 'react';
import Table from "@/components/reusables/table/Table";
import { client } from "@/utils/sanity/client";
import { FcNext, FcPrevious } from "react-icons/fc";
import Pagination from '@/components/reusables/Pagination';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // You can change this value to the desired number of rows per page
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const formatCurrency = useCurrencyFormatter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "transaction"] {
            _id,
            "product": order->products[0]->title,
            "order_id": order->_id,
            "date": transactionDate,
            "customer_name": userId->name,
            status,
            amount
          } | order(transactionDate desc)
        `);
        setTransactions(data);
        setFilteredTransactions(data); // Initialize filtered transactions with all data
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedData = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle Filter
  useEffect(() => {
    let updatedTransactions = transactions;

    if (filter !== "all") {
      updatedTransactions = transactions.filter(transaction => transaction.status === filter);
    }

    if (searchTerm) {
      updatedTransactions = updatedTransactions.filter(transaction => 
        Object.values(transaction).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredTransactions(updatedTransactions);
    setCurrentPage(1); // Reset to the first page after filtering
  }, [filter, searchTerm, transactions]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const customerColumn = [
    {
      title: "S/N",
      key: "sn",
      render: (data, index) => <span>{index + 1}</span>,
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
      render: (data) => <span>{new Date(data.date).toLocaleDateString() ?? "Not Available"}</span>,
    },
    {
      title: "Customer Name",
      key: "customer_name",
      render: (data) => <span>{data.customer_name ?? "Not Available"}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (data) => {
        const status = data?.status?.toLowerCase();
        const statusStyles = {
          success: { background: "#4BB543", color: "white" },
          canceled: { background: "#FF9494", color: "white" },
          pending: { background: "#F7CB73", color: "black" },
        };
        const style = statusStyles[status] || {};
        return (
          <span style={style} className={`py-2 px-4 rounded-full border ${status && `bg-${style.background}/30 border-${style.background} text-${style.color}`}`}>
            {data?.status}
          </span>
        );
      },
    },
    {
      title: "Amount",
      key: "amount",
      render: (data) => <span>{formatCurrency(data.amount ?? "Not Available")}</span>,
    },
  ];

  return (
    <section className="p-4 my-6">
      <div className="shadow-lg p-2">
        <h2 className="font-bold text-lg border-b-2 py-4 px-2 mb-3">All Transactions</h2>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="canceled">Canceled</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* {isLoading ? (
          <p>Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <p>No transactions available</p>
        ) : (
        )} */}
        <Table columns={customerColumn} data={paginatedData} isGray={false} />

        {/* Use Pagination Component */}
        <div className="my-8">

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </div>
      </div>
    </section>
  );
}
