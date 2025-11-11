import React, { useState, useEffect } from "react";
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const EditProductModal = ({ show, product, onClose, onUpdate }) => {
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([...product?.images || []]);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: Array.isArray(product?.category) ? product.category : [],
    sku: product?.sku || '',
    target: product?.target || '',
    price: product?.price || 0,
    discountedPrice: product?.discountedPrice || 0,
    countInStock: product?.countInStock || 0,
    description: product?.description || '',
    isFeatured: product?.isFeatured || false,
    bestSeller: product?.bestSeller ?? product?.bestseller ?? false,
    size: product?.size || ''
  });

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
      setExistingImages(product.images || []);
      setSelectedImages([]);
      setImagePreviews([...product.images || []]);
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

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6); // max 6
    setSelectedImages(prev => [...prev, ...files].slice(0, 6));
    setImagePreviews([...existingImages, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExisting);
      setImagePreviews([...updatedExisting, ...selectedImages.map(f => URL.createObjectURL(f))]);
    } else {
      const updatedSelected = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedSelected);
      setImagePreviews([...existingImages, ...updatedSelected.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requiredFields = ['name', 'description', 'category', 'brand', 'price', 'countInStock', 'size', 'sku', 'target'];
      const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
      if (emptyFields.length > 0) {
        toast.error(`Please fill all required fields: ${emptyFields.join(', ')}`);
        return;
      }

      // Upload new images if any
      let uploadedImages = [];
      if (selectedImages.length > 0) {
        uploadedImages = await Promise.all(selectedImages.map(file => handleImageUpload(file)));
      }

      const updatedProduct = {
        ...formData,
        _id: product._id,
        oldImages: existingImages, // keep the ones that weren’t removed
        images: uploadedImages, // newly added images
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
            <button onClick={onClose} className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition">
              <XMarkIcon className="w-8 h-8 text-[#663333]" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-2 mb-6">
              <PencilSquareIcon className="w-8 h-8 text-[#663333]" />
              <h2 className="text-3xl font-bold text-[#663333]">Edit Product</h2>
            </div>

            <form className="grid grid-cols-1 gap-4 text-left">
              {/* Name, Brand, SKU, Target, Category */}
              {['name','brand','sku','target','category'].map(field => (
                <div key={field}>
                  <label className="block font-semibold text-[#663333] mb-1 text-lg">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
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

              {/* Price & Discounted Price */}
              <div className="grid grid-cols-2 gap-4">
                {['price','discountedPrice'].map(field => (
                  <div key={field}>
                    <label className="block font-semibold text-[#663333] mb-1 text-lg">{field === 'price' ? 'Price' : 'Discounted Price'}</label>
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

              {/* Stock & Size */}
              <div className="grid grid-cols-2 gap-4">
                {['countInStock','size'].map(field => (
                  <div key={field}>
                    <label className="block font-semibold text-[#663333] mb-1 text-lg">{field === 'countInStock' ? 'Stock' : 'Size'}</label>
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

              {/* Description */}
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

              {/* Images */}
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Product Images (Max 6)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                          file:text-[#663333] file:bg-[#b2f7ef] file:font-semibold
                          hover:file:bg-[#e0c3fc] file:transition
                          text-sm text-[#663333]
                          border border-[#e0c3fc] rounded-xl p-2"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => {
                    const isExisting = idx < existingImages.length;
                    return (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#e0c3fc]">
                        <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeImage(isExisting ? idx : idx - existingImages.length, isExisting)}
                          className="absolute top-0 right-0 w-5 h-5 text-white bg-red-500 rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkboxes */}
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

            {/* Buttons */}
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
 