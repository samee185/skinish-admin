import React from "react";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";

const EditProductModal = ({ show, product, onClose }) => {
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
            className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-[#b2f7ef] text-[#663333] relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition"
            >
              <PencilSquareIcon className="w-12 h-12 mt-2 text-[#663333]" />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-[#663333]">Edit Product</h2>
            <form className="grid grid-cols-1 gap-4 text-left">
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Name</label>
                <input type="text" defaultValue={product.name} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Brand</label>
                <input type="text" defaultValue={product.brand} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Category</label>
                <input type="text" defaultValue={product.category} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Price</label>
                <input type="number" defaultValue={product.price} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg uppercase">Stock</label>
                <input type="number" defaultValue={product.countInStock} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-base" />
              </div>
              <div>
                <label className="block font-semibold text-[#663333] mb-1 text-lg">Description</label>
                <textarea defaultValue={product.description} className="w-full border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] resize-none text-base" rows={3} />
              </div>
              {/* Add more fields as needed */}
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
                // onClick={handleSaveEdit} // Implement save logic
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
