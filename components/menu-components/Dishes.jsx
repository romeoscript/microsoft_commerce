"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '@/utils/sanity/client';
import { addCartItem } from '@/store/reducers/cartReducer';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { getCookie } from '@/utils/getCookie';
import Pagination from '../reusables/Pagination';

// Modal Component
const DishModal = ({ dish, onClose, onAddToCart }) => {
  const formatCurrency = useCurrencyFormatter();

  // Close modal when clicking outside of it
  const handleOutsideClick = (event) => {
    if (event.target.id === 'modalOverlay') {
      onClose();
    }
  };

  return (
    <div
      id="modalOverlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black bg-opacity-70"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl h-auto p-4 sm:p-6 md:p-8 relative">
        <button className="absolute top-4 right-4 text-3xl font-bold text-white md:text-gray-600 lg:text-gray-600" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-4">
            <Image
              src={dish?.image?.asset?.url}
              alt={dish.title}
              layout="responsive"
              width={500}
              height={500}
              className="rounded-lg max-w-full max-h-96 object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-4 flex flex-col justify-between max-h-96 overflow-y-auto">
            <div>
              <h3 className="text-3xl font-bold mb-2">{dish.title}</h3>
              <p className="text-green-500 text-xl font-bold mb-4">{formatCurrency(dish.price)}</p>
              <p className="text-gray-700 mb-4">{dish.description}</p>
            </div>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              onClick={() => onAddToCart(dish)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fetch content from Sanity
async function getContent() {
  const query = `*[_type == "dish" && !(_id in path("drafts.*"))] | order(sortOrder asc) {
    _id,
    title,
    slug,
    description,
    price,
    category->{
      title
    },
    status,
    sortOrder,
    image {
      asset->{
        url
      }
    }
  }`;

  const content = await client.fetch(query);
  return content;
}

// Main Dishes Component
const Dishes = ({ selectedCategory }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 9; // Define the number of items per page
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input

  const dispatch = useDispatch();
  const formatCurrency = useCurrencyFormatter();
  const userId = getCookie("euodia_user");

  const handleAddToCart = (dish) => {
    try {
      dispatch(addCartItem({ dish, userId }));
      toast.success("Item added to cart", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error(err.message || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const fetchedDishes = await getContent();
        setDishes(fetchedDishes);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to load dishes", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    fetchDishes();
  }, []);

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on search change
  };

  const handleCloseModal = () => {
    setSelectedDish(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  // Combine category and search filtering
  const filteredDishes = dishes.filter((dish) =>
    (!selectedCategory || dish.category.title === selectedCategory) &&
    (dish.title.toLowerCase().includes(searchQuery) ||
      dish.description.toLowerCase().includes(searchQuery) ||
      dish.price.toString().includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredDishes?.length / itemsPerPage);
  const displayedDishes = filteredDishes?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-4 py-2 mb-4 text-gray-700 bg-white border rounded-md focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-40"
        />


        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-accent rounded-full animate-spin"></div>
            </div>
          ) : displayedDishes.length > 0 ? (
            displayedDishes.map((dish) => (
              <div
                key={dish._id}
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
                onClick={() => handleDishClick(dish)}
              >
                <div className="relative h-60 mb-4 border-3 border-green-600">
                  <Image
                    src={dish?.image?.asset?.url}
                    alt={dish.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg aspect-square"
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold sentence leading-[1.10]">{dish.title}</h3>
                  <p className="text-green-500 text-lg font-bold">{formatCurrency(dish.price)}</p>
                </div>
                <p className="text-gray-600 mb-2">{dish.description}</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No dishes available in this category.</p>
          )}
        </div>

        {/* Pagination Component */}
        <div className="my-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Dishes;
