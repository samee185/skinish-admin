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
    setImagePreviews([...existingImages, ...selectedImages.map(f => URL.createObjectURL(f)), ...files.map(f => URL.createObjectURL(f))]);
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
        <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 hover:text-red-500">
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Product Images</h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                  <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleSubmit}
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
