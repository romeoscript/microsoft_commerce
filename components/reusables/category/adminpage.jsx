'use client';

import React, { useState, useEffect } from 'react';
import { client } from "@/utils/sanity/client";
import { useCategories } from '@/hooks/swr/useCategories';
import { toast } from 'react-toastify';

const updateCategoryStatus = async (categoryId, newStatus) => {
  try {
    await client
      .patch(categoryId)
      .set({ active: newStatus })
      .commit();
    toast.success('Category status updated successfully');

    return true;
  } catch (error) {
    console.error('Error updating category status:', error);
    toast.error('Failed to update category status.');
    return false;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    await client.delete(categoryId);
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category.');
    return false;
  }
};

const addOrUpdateCategory = async (category) => {
  try {
    if (category._id) {
      // Update existing category
      await client
        .patch(category._id)
        .set({
          title: category.title,
          description: category.description,
          active: category.active,
        })
        .commit();
      toast.success('Category updated successfully');
    } else {
      // Check if the category with the same name already exists
      const existingCategory = await client.fetch(
        `*[_type == "category" && title == $title][0]`,
        { title: category.title }
      );

      if (existingCategory) {
        toast.error(`Category "${category.title}" already exists.`);
        return;
      }

      // Add new category
      await client.create(category);
      toast.success('Category added successfully');
    }
    
  } catch (error) {
    console.error('Error adding or updating category:', error);
    toast.error('Failed to add or update category.');
  }
};

const AdminCategoryPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const { categories, isLoading, mutate, isError } = useCategories();

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.title);
      setDescription(category.description);
      setStatus(category.active ? 'active' : 'inactive');
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setDescription('');
      setStatus('active');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      _type: 'category',
      title: categoryName,
      description,
      active: status === 'active',
    };

    if (editingCategory) {
      categoryData._id = editingCategory._id; // Include _id for editing
    }

    await addOrUpdateCategory(categoryData);

    // Re-fetch categories after adding or updating
    mutate();

    // Close the modal and reset the form
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
    setDescription('');
    setStatus('active');
  };

  const handleStatusToggle = async (categoryId, currentStatus) => {
    const newStatus = !currentStatus;
    const success = await updateCategoryStatus(categoryId, newStatus);

    if (success) {
      // Re-fetch categories after status update
      mutate();
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const success = await deleteCategory(categoryId);

    if (success) {
      // Re-fetch categories after deletion
      mutate();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading categories.</p>
        ) : (
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Category Name</th>
                <th className="px-4 py-2 border-b text-left">Description</th>
                <th className="px-4 py-2 border-b text-left">Products</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-4 py-2 border-b">{category.title}</td>
                  <td className="px-4 py-2 border-b">{category.description}</td>
                  <td className="px-4 py-2 border-b">{category.dishCount}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded ${
                        category.active
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleOpenModal(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleStatusToggle(category._id, category.active)}
                    >
                      {category.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Status</label>
                <select
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryPage;
