import React, { useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const EditProductModal = ({ show, product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: [],
    ingredients: '',
    sku: '',
    target: '',
    price: 0,
    discountedPrice: 0,
    countInStock: 0,
    description: '',
    isFeatured: false,
    bestseller: false,
    size: ''
  });

  const [categoryInput, setCategoryInput] = useState('');

  // Load existing product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: Array.isArray(product.category) ? product.category : [],
        ingredients: product.ingredients || '',
        sku: product.sku || '',
        target: product.target || '',
        price: product.price || 0,
        discountedPrice: product.discountedPrice || 0,
        countInStock: product.countInStock || 0,
        description: product.description || '',
        isFeatured: product.isFeatured || false,
        bestseller: product.bestseller ?? false,
        size: product.size || ''
      });

      // Join categories using commas only
      setCategoryInput(
        Array.isArray(product.category)
          ? product.category.join(', ')
          : ''
      );
    }
  }, [product]);


  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'category') {
      setCategoryInput(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };


  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated string → array
    const categories = categoryInput
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat !== "");

    const updatedFormData = {
      ...formData,
      category: categories,
    };

    // Required validation
    const requiredFields = [
      "name","description","category","brand","price",
      "countInStock","size","sku","target"
    ];

    const emptyFields = requiredFields.filter(
      field =>
        !updatedFormData[field] ||
        (Array.isArray(updatedFormData[field]) && updatedFormData[field].length === 0)
    );

    if (emptyFields.length > 0) {
      toast.error(`Please fill all required fields: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      await onUpdate(updatedFormData, false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Error updating product");
    }
  };


  return (
    <AnimatePresence>
      {show && product && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#ffe1f0]/80 backdrop-blur-sm z-50 overflow-y-auto pt-[630px] pb-12 capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center border border-[#ffe1f0] text-[#663333] relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            {/* Title */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-8">
              <PencilSquareIcon className="w-8 h-8 text-[#663333]" />
              <h2 className="text-3xl font-extrabold tracking-wide">Edit Product</h2>
            </div>

            {/* FORM */}
            <form className="grid grid-cols-1 gap-5 text-left">

              {/* Standard Fields */}
              {["name","brand","sku","target"].map((field) => (
                <div key={field}>
                  <label className="block font-semibold mb-1 text-lg">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                  />
                </div>
              ))}

              {/* Ingredients */}
              <div>
                <label className="block font-semibold mb-1 text-lg">Ingredients</label>
                <textarea
                  name="ingredients"
                  rows={3}
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                />
              </div>

              {/* Category Input */}
              <div>
                <label className="block font-semibold mb-1 text-lg">Categories</label>
                <input
                  type="text"
                  name="category"
                  value={categoryInput}
                  onChange={handleChange}
                  placeholder="Separate using commas ONLY e.g. face cream, toner"
                  className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                />
              </div>

              {/* Price + Discount */}
              <div className="grid grid-cols-2 gap-4">
                {["price","discountedPrice"].map((field) => (
                  <div key={field}>
                    <label className="block font-semibold mb-1 text-lg">
                      {field === "price" ? "Price" : "Discounted Price"}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                    />
                  </div>
                ))}
              </div>

              {/* Stock + Size */}
              <div className="grid grid-cols-2 gap-4">
                {["countInStock","size"].map((field) => (
                  <div key={field}>
                    <label className="block font-semibold mb-1 text-lg">
                      {field === "countInStock" ? "Stock" : "Size"}
                    </label>
                    <input
                      type={field === "countInStock" ? "number" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-lg">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-[#ffe1f0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#663333]/30"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-8 mt-2">
                <label className="flex items-center gap-2 font-semibold text-lg">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded focus:ring-[#663333]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 font-semibold text-lg">
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                    className="w-5 h-5 rounded focus:ring-[#663333]"
                  />
                  Best Seller
                </label>
              </div>
            </form>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold hover:bg-[#ffd8e8] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-[#663333] text-white font-bold hover:bg-[#522626] transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;
