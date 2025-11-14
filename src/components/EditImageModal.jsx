import React, { useState, useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const EditProductImagesModal = ({ show, product, onClose, onUpdateImages }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setExistingImages(product.images || []);
      setSelectedImages([]);
      setImagePreviews(product.images || []);
    }
  }, [product]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + selectedImages.length + files.length > 6) {
      toast.error("You can upload up to 6 images only.");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    setImagePreviews([
      ...existingImages,
      ...selectedImages.map(f => URL.createObjectURL(f)),
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);
      setImagePreviews([...updated, ...selectedImages.map(f => URL.createObjectURL(f))]);
    } else {
      const selIndex = index - existingImages.length;
      const updated = [...selectedImages];
      updated.splice(selIndex, 1);
      setSelectedImages(updated);
      setImagePreviews([...existingImages, ...updated.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + selectedImages.length > 6) {
      toast.error("Cannot exceed 6 images.");
      return;
    }

    const formData = new FormData();
    existingImages.forEach(url => formData.append("existingImages", url));
    selectedImages.forEach(file => formData.append("images", file));

    try {
      await onUpdateImages(product._id, formData);
      onClose();
    } catch (err) {
      toast.error(err.message || "Error updating images");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-[#663333] hover:text-[#ffe1f0] hover:scale-110 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-bold mb-6 text-center text-[#663333]">Edit Product Images</h2>

            {/* File Input */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#663333] rounded-lg p-4 cursor-pointer hover:border-[#12b262] hover:bg-[#ffe1f0] transition">
              <span className="text-[#663333]">Click or drag images here (Max 6)</span>
              <input
                type="file"
                multiple
                accept="image/*,image/avif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-3 mt-5 max-h-60 overflow-y-auto pr-2">
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer border border-[#663333]"
                >
                  <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-[#663333] text-[#ffe1f0] rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-[#663333] text-[#ffe1f0] py-3 rounded-xl font-semibold shadow-lg hover:bg-[#ffe1f0] hover:text-[#663333] hover:scale-105 transition-all border border-[#663333]"
            >
              Save Images
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductImagesModal;
