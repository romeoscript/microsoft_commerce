import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputComponent from "@/components/reusables/input/InputComponent";
import SelectComponent from "@/components/reusables/input/SelectComponent";
import Button from "@/components/reusables/buttons/Button";
import { uploadImageToSanity } from "@/utils/sanity/uploadImageToSanity";
import { getCookie } from "@/utils/getCookie";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

const mealSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  status: yup.string().required("Status is required"),
});

const statusOptions = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

const EditMealModal = ({ isOpen, onClose, meal, mutate }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mealSchema),
  });
  const token = getCookie("admineu_token"); // Retrieve the token

  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(null); // State to handle the image to be displayed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meal) {
      setValue("title", meal.title);
      setValue("description", meal.description);
      setValue("price", meal.price);
      setValue("status", meal.status);
      setDisplayImage(meal.image?.asset?.url || null); // Display the existing image URL
    }
  }, [meal, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setDisplayImage(URL.createObjectURL(file)); // Update the displayed image with the newly selected image
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token
        },
      };

      // Check if a new image is selected, otherwise do not include the image field
      let updatedMealData = {
        mealId: meal._id,
        title: data.title,
        description: data.description,
        price: data.price,
        status: data.status,
      };

      if (selectedImage && typeof selectedImage !== "string") {
        const imageAssetId = await uploadImageToSanity(selectedImage); // Upload new image if it is a file object
        updatedMealData.image = {
          _type: "image",
          asset: { _type: "reference", _ref: imageAssetId },
        };
      }

      // Make API call to update the meal
      const res = await axios.patch(
        "/api/admin/update-meal",
        updatedMealData,
        config
      );

      toast.success("Meal updated successfully!");
      mutate(); // Refresh the data

      reset(); // Reset the form after successful submission
      setSelectedImage(null); // Clear the selected image
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error editing meal:", error);
      toast.error("Failed to update meal.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-2xl w-full p-6 relative z-50">
          <h2 className="text-xl font-bold mb-4">Edit Meal</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-x-6 w-full">
              <div className="w-full">
                <InputComponent
                  label="Title"
                  name="title"
                  error={errors.title?.message}
                  register={register}
                />
              </div>
              <div className="w-full">
                <InputComponent
                  label="Description"
                  name="description"
                  error={errors.description?.message}
                  register={register}
                />
              </div>
            </div>

            <InputComponent
              label="Price"
              type="number"
              name="price"
              error={errors.price?.message}
              register={register}
            />

            <SelectComponent
              label="Status"
              options={statusOptions}
              name="status"
              error={errors.status?.message}
              register={register}
            />

            <div className="grid">
              <p className="font-medium text-sm">Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full py-1 px-3 outline-none bg-inherit rounded-md border border-accent text-sm"
              />
              {displayImage && (
                <Image
                  src={displayImage}
                  alt="Selected"
                  className="mt-2 h-32 w-32 object-cover rounded-md"
                />
              )}
            </div>

            <div className="relative z-999999">
              <Button
                type="submit"
                title="Save Changes"
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

export default EditMealModal;
