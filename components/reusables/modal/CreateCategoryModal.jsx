import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputComponent from "@/components/reusables/input/InputComponent";
import Button from "@/components/reusables/buttons/Button";
import { getCookie } from "@/utils/getCookie";
import { toast } from "react-toastify";
import axios from "axios";
import { handleGenericError } from "@/utils/errorHandler";

const categorySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const CreateCategoryModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(categorySchema),
  });
  const adminToken = getCookie("admineu_token");
  const [loading, setLoading] = useState(false);

  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
  
      const response = await axios.post('/api/admin/category', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`, // Include your token here
        },
      });
  
      if (response.status === 201) {
        toast.success("Category created successfully");
        reset(); // Reset the form after successful submission
        onClose(); // Close the modal
      } 
    } catch (error) {
      const errMsg = handleGenericError(error)
      toast.error(errMsg);
      console.log("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-2xl w-full p-6 relative z-50">
          <h2 className="text-xl font-bold mb-4">Create a New Category</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputComponent
              label="Title"
              name="title"
              error={errors.title?.message}
              register={register}
            />
            <InputComponent
              label="Description"
              name="description"
              error={errors.description?.message}
              register={register}
            />
            <div className="relative z-999999">
              <Button
                type="submit"
                title="Submit"
                color="accent"
                isLoading={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
