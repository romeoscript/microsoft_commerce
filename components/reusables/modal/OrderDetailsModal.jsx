import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold border-b py-2 text-gray-700 mb-2">
              Customer Details
            </h3>
            <div className="space-y-1 text-gray-600">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold border-b py-2 text-gray-700 mb-2">Address</h3>
            <div className="space-y-1 text-gray-600">
              <p><strong>Street Address:</strong> {order.streetAddress}</p>
              <p><strong>Apartment:</strong> {order.apartment || "N/A"}</p>
              <p><strong>City/Town:</strong> {order.townCity}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b py-2 text-gray-700 mb-2">
            Order Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p><strong>Transaction Reference:</strong> {order.transactionRef}</p>
              <p><strong>Total Amount:</strong> ${order.total}</p>
            </div>
            <div>
              <p><strong>Notes:</strong> {order.notes || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b py-2 text-gray-700 mb-4">Products</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.products.map((product, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg shadow flex items-center">
                <Image
                  src={product.imageUrl} // Assuming the image URL is provided in product object
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex flex-col">
                  <p className="text-gray-800"><strong>{product.title}</strong></p>
                  <p className="text-gray-600"><strong>Price:</strong> ${product.price}</p>
                  <p className="text-gray-600"><strong>Quantity:</strong> {product.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;
