import React, { useState, useRef, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const EditProductModal = ({ show, product, onClose, onUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: Array.isArray(product?.category) ? product.category : [],
    price: product?.price || 0,
    discountedPrice: product?.discountedPrice || 0,
    countInStock: product?.countInStock || 0,
    description: product?.description || '',
    isFeatured: product?.isFeatured || false,
    // initialize from either `bestSeller` or backend `bestseller` field
    bestSeller: product?.bestSeller ?? product?.bestseller ?? false,
    size: product?.size || ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: Array.isArray(product.category) ? product.category : [],
        price: product.price || '',
        discountedPrice: product.discountedPrice || '',
        countInStock: product.countInStock || '',
        description: product.description || '',
        isFeatured: product.isFeatured || false,
        bestSeller: product.bestSeller ?? product.bestseller ?? false,
        size: product.size || ''
      });
      setImagePreview(product.images?.[0] || null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      // Split by commas and trim each category
      const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      setFormData(prev => ({
        ...prev,
        [name]: categories
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    // Convert the file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  return (
    <AnimatePresence>
      {show && product && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#ffe1f0]/80 backdrop-blur-sm z-50 pt-44 overflow-y-auto capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-[#b2f7ef] text-[#663333] relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition"
            >
              <XMarkIcon className="w-8 h-8 text-[#663333]" />
            </button>
            <div className="flex items-center justify-center gap-2 mt-2 mb-6">
              <PencilSquareIcon className="w-8 h-8 text-[#663333
              ]" />
              <h2 className="text-3xl font-bold text-[#663333]"> Edit Product</h2>
            </div>
            <form className="grid grid-cols-1 gap-4 text-left">
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand} 
                  onChange={handleChange}
                  className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Category</label>
                <input 
                  type="text" 
                  name="category"
                  value={Array.isArray(formData.category) ? formData.category.join(', ') : ''} 
                  onChange={handleChange}
                  placeholder="Enter categories separated by commas"
                  className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Price</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price} 
                    onChange={handleChange}
                    className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Discounted Price</label>
                  <input 
                    type="number" 
                    name="discountedPrice"
                    value={formData.discountedPrice} 
                    onChange={handleChange}
                    className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Stock</label>
                  <input 
                    type="number" 
                    name="countInStock"
                    value={formData.countInStock} 
                    onChange={handleChange}
                    className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Size</label>
                  <input 
                    type="text" 
                    name="size"
                    value={formData.size} 
                    onChange={handleChange}
                    className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Description</label>
                <textarea 
                  name="description"
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] resize-none text-base" 
                  rows={3} 
                />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Product Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-[#e0c3fc]"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                              file:text-[#663333] file:bg-[#b2f7ef] file:font-semibold
                              hover:file:bg-[#e0c3fc] file:transition
                              text-sm text-[#663333]
                              border border-[#e0c3fc] rounded-xl p-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#b2f7ef] border-[#e0c3fc] rounded focus:ring-[#b2f7ef] mr-2"
                  />
                  <label htmlFor="isFeatured" className="font-semibold text-[#663333] text-lg">Featured Product</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bestSeller"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#b2f7ef] border-[#e0c3fc] rounded focus:ring-[#b2f7ef] mr-2"
                  />
                  <label htmlFor="bestSeller" className="font-semibold text-[#663333] text-lg">Best Seller</label>
                </div>
              </div>
            </form>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition text-lg"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition text-lg"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    // Validate required fields
                    const requiredFields = ['name', 'description', 'category', 'brand', 'price', 'countInStock', 'size'];
                    const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
                    
                    if (emptyFields.length > 0) {
                      toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
                      return;
                    }

                    let updatedImages = product.images;
                    if (selectedImage) {
                      const base64Image = await handleImageUpload(selectedImage);
                      updatedImages = [base64Image];
                    }

                    const updatedProduct = {
                      ...formData,
                      _id: product._id,
                      images: updatedImages,
                      price: Number(formData.price),
                      discountedPrice: Number(formData.discountedPrice || 0),
                      countInStock: Number(formData.countInStock)
                    };

                    if (typeof onUpdate === 'function') {
                      await onUpdate(updatedProduct);
                      onClose();
                    } else {
                      console.error('onUpdate prop is not a function');
                    }
                  } catch (error) {
                    console.error('Error updating product:', error);
                    toast.error(error.message || 'Error updating product');
                  }
                }}
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
