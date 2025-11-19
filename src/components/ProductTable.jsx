import React, { useState, useMemo } from "react";
import { useProduct } from "../contexts/ProductContext"; 
import {
  TrashIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import EditProductModal from "./EditProductModal";
import EditProductImagesModal from "./EditImageModal";

const ProductTable = () => {
  const { products, deleteProduct, updateProduct, updateProductImages } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [editImageProduct, setEditImageProduct] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
      setShowModal(false);
      setSelectedProductId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  const handleViewClick = (productId) => {
    navigate(`/shop/${productId}`);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleEditImageClick = (product) => {
    setEditImageProduct(product);
    setShowEditImageModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleCloseEditImageModal = () => {
    setShowEditImageModal(false);
    setEditImageProduct(null);
  };

  const filteredProducts = useMemo(() => {
    const list = products || [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((product) => {
      const name = (product?.name || "").toLowerCase();
      const sku = (product?.sku || "").toLowerCase();
      return name.includes(q) || sku.includes(q);
    });
  }, [products, searchTerm]);

  return (
    <>
      <div className="container text-[#663333] mx-auto px-4 overflow-hidden">
        <h1 className="text-3xl font-extrabold mb-4 text-center tracking-tight flex items-center justify-center gap-2">
          {/* <span>All Products List</span> */}
          {/* <span className="inline-block align-middle">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="10" rx="2" stroke="#e0c3fc" strokeWidth="1.5"/>
              <circle cx="8" cy="12" r="2" fill="#b2f7ef"/>
            </svg>
          </span> */}
        </h1>

        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-5 backdrop-blur-md bg-[#fff7fa]/90 p-4 flex items-center justify-between gap-4 rounded-t-2xl shadow-md border-b border-[#ffe1f0] transition-all">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 border border-[#e0c3fc] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] text-sm text-[#663333] shadow-sm"
            />
          </div>
          <div>
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-[#ffe1f0] text-[#663333] rounded-lg border border-[#ffe1f0] hover:bg-[#f7e6ff] transition text-sm shadow-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto border border-[#f3d6e3] rounded-b-2xl shadow-2xl max-h-[550px] overflow-y-auto mt-0">
          <table className="min-w-full bg-white/90 text-sm">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-gradient-to-r from-[#ffe1f0]/90 via-[#e0c3fc]/90 to-[#b2f7ef]/90 border-b border-[#e0c3fc] shadow-sm">
              <tr>
                <th className="py-3 px-4 font-bold text-[#663333]">Image</th>
                <th className="py-3 px-4 font-bold text-[#663333]">SKU</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Name</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Brand</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Category</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Price</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Stock</th>  
                <th className="py-3 px-4 font-bold text-[#663333]">BestSeller</th>
                <th className="py-3 px-4 font-bold text-[#663333]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:shadow-lg hover:scale-[1.02] transition-all text-sm rounded-lg">
                    <td className="py-2 px-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#e0c3fc] shadow-md bg-[#fff7fa] flex items-center justify-center">
                        <img
                          src={product?.images[0]}
                          alt={product?.title}
                          className="object-cover w-full h-full cursor-pointer"
                          onClick={() => handleEditImageClick(product)}
                        />
                        <button
                          onClick={() => handleEditImageClick(product)}
                          className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm hover:scale-105 transition"
                          title="Edit images"
                        >
                          <PencilSquareIcon className="w-4 h-4 text-[#663333]" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 font-semibold text-[#663333] max-w-[120px] truncate" title={product?.sku}>{product?.sku}</td>
                    <td className="py-2 px-4 font-semibold text-[#663333] max-w-[120px] truncate" title={product?.name}>{product?.name}</td>
                    <td className="py-2 px-4 text-[#663333] max-w-[100px] truncate" title={product?.brand}>{product?.brand}</td>
                    <td className="py-2 px-4 text-[#663333] max-w-[100px] truncate" title={product?.category}>{product?.category}</td>
                    <td className="py-2 px-4 text-[#663333] font-bold">{`₦${product?.price}`}</td>
                    <td className="py-2 px-4 text-[#663333]">{product?.countInStock}</td>
                    <td className="py-2 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${product?.bestseller ? 'bg-[#b2f7ef] text-[#663333]' : 'bg-gray-200 text-gray-500'}`}>{product?.bestseller ? "Yes" : "No"}</span>
                    </td>
                    <td className="py-2 px-4 flex gap-2 items-center mt-4">
                      <button
                        className="bg-[#e0c3fc] hover:bg-[#b2f7ef] text-[#663333] font-bold px-2 py-1 rounded-lg shadow transition-all border border-[#e0c3fc] flex items-center gap-1 text-xs"
                        onClick={() => handleViewClick(product._id)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="bg-[#b2f7ef] hover:bg-[#e0c3fc] text-[#663333] font-bold px-2 py-1 rounded-lg shadow transition-all border border-[#b2f7ef] flex items-center gap-1 text-xs"
                        onClick={() => handleEditClick(product)}
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="bg-[#ffe1f0] hover:bg-red-200 text-red-600 font-bold px-2 py-1 rounded-lg shadow transition-all border border-[#ffe1f0] flex items-center gap-1 text-xs"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-[#663333] font-semibold text-sm">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#ffe1f0]">
            <div className="mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto mb-2 text-red-500">
                <path d="M12 9v4m0 4h.01" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2"/>
              </svg>
              <h2 className="text-xl font-bold text-[#663333]">Delete Product?</h2>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this product? This action cannot be undone.</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold border border-red-500 hover:bg-red-600 transition"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <EditProductModal 
        show={showEditModal} 
        product={editProduct} 
        onClose={handleCloseEditModal}
        onUpdate={(updatedProduct) => {
          updateProduct(editProduct._id, updatedProduct)
            .then(() => handleCloseEditModal())
            .catch((error) => console.error('Error updating product:', error));
        }}
      />
      {/* Edit Product Images Modal */}
      <EditProductImagesModal
        show={showEditImageModal}
        product={editImageProduct}
        onClose={handleCloseEditImageModal}
        onUpdateImages={updateProductImages}
      />
    </>
  );
};

export default ProductTable;
