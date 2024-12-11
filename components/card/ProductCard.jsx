import Image from "next/image";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { client } from '@/utils/sanity/client'; // Assuming the client is set up for Sanity
import EditMealModal from "../reusables/modal/EditMealModal";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "@/utils/getCookie";

const ProductCard = ({ product, mutate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMealModalOpen, setIsEditMealModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = getCookie('admineu_token'); // Retrieve the token
  const menuRef = useRef(null); // Ref for the menu
  const buttonRef = useRef(null); // Ref for the button to toggle menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    setIsEditMealModalOpen(true);
    setIsMenuOpen(false); // Close menu after selecting edit
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token
        },
      };
      const res = await axios.delete(`/api/admin/delete-meal?productId=${product._id}`, config);

      console.log(res);
      toast.success("Product deleted successfully!");
      mutate();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product.");
    } finally {
      setIsLoading(false);
    }
    setIsMenuOpen(false); // Close menu after selecting delete
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false); // Close menu when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine status color based on product status
  const statusColor = product.status ? "bg-green-500" : "bg-gray-400";

  return (
    <div className="bg-[#F9FAFB] shadow-md rounded-lg p-4 w-full max-w-sm relative">
      <div className="flex items-center gap-6 justify-between">
        <div className="w-[120px] h-[120px]">
          <Image
            src={product?.image?.asset?.url}
            alt={product.title}
            width={50}
            height={50}
            className="rounded-lg object-cover aspect-square w-full"
          />
        </div>
        <div className="mt-4 space-y-4 flex-grow">
          <h2 className="text-md font-semibold flex items-center">
            {product.title}
            <span className={`ml-2 w-3 h-3 rounded-full ${statusColor}`} />
          </h2>
          <p className="text-gray-600">{product.category.title}</p>
          <p className="text-md font-bold">₦{product.price}</p>
        </div>
        <button
          ref={buttonRef} // Reference for the button
          onClick={toggleMenu}
          className="text-[#374151] p-4 rounded-md bg-[#E5E7EB] hover:text-gray-600 relative"
        >
          <BsThreeDots />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef} // Reference for the menu
            className="absolute right-16 top-10 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 z-10"
          >
            <button
              onClick={handleEdit}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold">Description</h3>
        <p className="text-gray-600">{product.description}</p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white opacity-50 flex items-center justify-center">
          Loading...
        </div>
      )}

      <EditMealModal
        isOpen={isEditMealModalOpen}
        onClose={() => setIsEditMealModalOpen(false)}
        meal={product}
        mutate={mutate}
      />
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired, // Ensure status is provided
  }).isRequired,
  mutate: PropTypes.func.isRequired,
};

export default ProductCard;
