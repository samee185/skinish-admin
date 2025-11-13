import React, { useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const EditProductModal = ({ show, product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: [],
    sku: '',
    target: '',
    price: 0,
    discountedPrice: 0,
    countInStock: 0,
    description: '',
    isFeatured: false,
    bestSeller: false,
    size: ''
  });

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: Array.isArray(product.category) ? product.category : [],
        sku: product.sku || '',
        target: product.target || '',
        price: product.price || 0,
        discountedPrice: product.discountedPrice || 0,
        countInStock: product.countInStock || 0,
        description: product.description || '',
        isFeatured: product.isFeatured || false,
        bestSeller: product.bestSeller ?? product.bestseller ?? false,
        size: product.size || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      setFormData(prev => ({ ...prev, [name]: categories }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requiredFields = [
        'name', 'description', 'category', 'brand',
        'price', 'countInStock', 'size', 'sku', 'target'
      ];

      const emptyFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].toString().trim() === ''
      );
      if (emptyFields.length > 0) {
        toast.error(`Please fill all required fields: ${emptyFields.join(', ')}`);
        return;
      }

      // Send JSON directly — images handled separately
      await onUpdate(formData, false);

      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Error updating product');
    }
  };

  return (
    <AnimatePresence>
      {show && product && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#ffe1f0]/80 backdrop-blur-sm z-50 pt-96 overflow-y-auto capitalize"
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
            <button onClick={onClose} className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition">
              <XMarkIcon className="w-8 h-8 text-[#663333]" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-2 mb-6">
              <PencilSquareIcon className="w-8 h-8 text-[#663333]" />
              <h2 className="text-3xl font-bold text-[#663333]">Edit Product</h2>
            </div>

            <form className="grid grid-cols-1 gap-4 text-left">
              {['name','brand','sku','target','category'].map(field => (
                <div key={field}>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={field==='category' ? formData.category.join(', ') : formData[field]}
                    onChange={handleChange}
                    placeholder={field==='category' ? 'Separate categories with commas' : ''}
                    className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {['price','discountedPrice'].map(field => (
                  <div key={field}>
                    <label className="block font-semibold text-[#663333] mb-1 text-lg">
                      {field === 'price' ? 'Price' : 'Discounted Price'}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['countInStock','size'].map(field => (
                  <div key={field}>
                    <label className="block font-semibold text-[#663333] mb-1 text-lg">
                      {field==='countInStock'?'Stock':'Size'}
                    </label>
                    <input
                      type={field==='countInStock'?'number':'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base"
                    />
                  </div>
                ))}
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
              <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition text-lg">
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition text-lg"
                onClick={handleSubmit}
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
