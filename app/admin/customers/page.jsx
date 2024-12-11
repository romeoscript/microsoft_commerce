"use client";
import Pagination from '@/components/reusables/Pagination';
import Table from '@/components/reusables/table/Table';
import { client } from '@/utils/sanity/client';
import React, { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "customer"] {
            _id,
            name,
            email,
            orderCount,
            totalSpent,
            isAnonymous,
            createdAt
          } | order(createdAt desc)
        `);
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedData = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    let updatedCustomers = customers;

    if (filter !== "all") {
      updatedCustomers = customers.filter(customer => customer.isAnonymous === (filter === "anonymous"));
    }

    if (searchTerm) {
      updatedCustomers = updatedCustomers.filter(customer => 
        Object.values(customer).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredCustomers(updatedCustomers);
    setCurrentPage(1);
  }, [filter, searchTerm, customers]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const customerColumns = [
    {
      title: "S/N",
      key: "sn",
      render: (data, index) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      key: "name",
      render: (data) => <span>{data.name}</span>,
    },
    {
      title: "Email",
      key: "email",
      render: (data) => <span>{data.email}</span>,
    },
    {
      title: "Order Count",
      key: "orderCount",
      render: (data) => <span>{data.orderCount}</span>,
    },
    {
      title: "Total Spent",
      key: "totalSpent",
      render: (data) => <span>{`₦${data.totalSpent.toFixed(2)}`}</span>,
    },
    {
      title: "Date Joined",
      key: "createdAt",
      render: (data) => {
        const date = new Date(data.createdAt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Customer Type",
      key: "isAnonymous",
      render: (data) => (
        <span className={`py-1 px-2 rounded-full ${data.isAnonymous ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {data.isAnonymous ? 'Anonymous' : 'Registered'}
        </span>
      ),
    },
  ];

  return (
    <section className="p-4 my-6">
      <div className=" mx-auto shadow-lg p-4">
        <h2 className="font-bold text-xl border-b-2 pb-4 mb-6">Customer List</h2>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Customers</option>
            <option value="registered">Registered</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>

        <Table columns={customerColumns} isLoading={isLoading} data={paginatedData} isGray={false} />

        <div className="my-6 flex justify-center">
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
