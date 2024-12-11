"use client"
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex list-none justify-center">
        {currentPage > 1 && (
          <li className="mx-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded bg-gray-200 text-black"
            >
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className="mx-1">
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className="mx-1">
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded bg-gray-200 text-black"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
