'use client';
import { useState } from 'react';
import AdminCategoryPage from "@/components/reusables/category/adminpage";
import ServiceFeeForm from "@/components/ServiceFeeForm";
import { toast } from "react-toastify";
import { getCookie } from "@/utils/getCookie";
import { useServiceFees } from '@/hooks/swr/useServiceFee';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import PopularMeals from '@/components/reusables/category/PopularMeals';

export default function AdminPage() {
  const adminToken = getCookie("admineu_token");

  const [activeTab, setActiveTab] = useState('categories');
  const [selectedServiceFee, setSelectedServiceFee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formatCurrency = useCurrencyFormatter();

  const { serviceFees, isLoading, mutate } = useServiceFees();

  const handleEditServiceFee = (serviceFee) => {
    setSelectedServiceFee(serviceFee);
    setShowForm(true);
  };

  const handleDeleteServiceFee = async (id) => {
    if (confirm("Are you sure you want to delete this service fee?")) {
      await fetch(`/api/admin/servicefee/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`, // Include your token here
        },
      });

      toast.success("Deleted Successfully");
      mutate(); // Revalidate the data after deletion
    }
  };

  const handleFormClose = () => {
    setSelectedServiceFee(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    mutate(); // Revalidate the data after form submission
    handleFormClose();
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 mr-4 border-b-2 ${activeTab === 'categories' ? 'border-green-600 text-black-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('serviceFees')}
            className={`px-4 py-2 border-b-2 ${activeTab === 'serviceFees' ? 'border-green-600 text-black-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Service Fees
          </button>
          <button
            onClick={() => setActiveTab('popularMeals')}
            className={`px-4 py-2 border-b-2 ${activeTab === 'popularMeals' ? 'border-green-600 text-black-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Popular Meals
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'categories' && (
          <AdminCategoryPage />
        )}

        {activeTab === 'serviceFees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Service Fees</h2>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowForm(true)}
                >
                  Add New Service Fee
                </button>
              </div>

              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="px-6 py-3 text-left font-semibold">Location Name</th>
                        <th className="px-6 py-3 text-left font-semibold">Fee</th>
                        <th className="px-6 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                      {serviceFees?.map((service) => (
                        <tr key={service._id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="px-6 py-3">{service.location}</td>
                          <td className="px-6 py-3">{formatCurrency(service.fee)}</td>
                          <td className="px-6 py-3 flex items-center gap-4">
                            <button
                              className="text-green-500 hover:text-black-700"
                              onClick={() => handleEditServiceFee(service)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteServiceFee(service._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {showForm && (
              <div className="bg-white p-4 border border-gray-300 rounded-lg">
                <ServiceFeeForm
                  serviceFee={selectedServiceFee}
                  onClose={handleFormClose}
                  onSuccess={handleFormSuccess}
                  mutate={mutate}
                />
              </div>
            )}
          </div>
        )}

{activeTab === 'popularMeals' && (
          <PopularMeals />
        )}
      </div>
    </div>
  );
}
