import React from "react";
import { useProduct } from "../contexts/ProductContext"; 
import {
  TrashIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import EditProductModal from "./EditProductModal";

const ProductTable = () => {
  const { products, deleteProduct, updateProduct } = useProduct();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState(null);
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  return (
    <>
      <div className="container text-[#663333] mx-auto p-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <span>All Products List</span>
          <span className="inline-block align-middle">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#e0c3fc" strokeWidth="1.5"/><circle cx="8" cy="12" r="2" fill="#b2f7ef"/></svg>
          </span>
        </h1>
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-[#f3d6e3] bg-gradient-to-br from-[#fff7fa] via-[#ffe1f0] to-[#f7e6ff]">
          <table className="min-w-full bg-white/90 rounded-2xl text-sm">
            <thead>
              <tr className="w-full bg-gradient-to-r from-[#ffe1f0] via-[#e0c3fc] to-[#b2f7ef] text-left text-xs">
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Image</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">SKU</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Name</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Brand</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Category</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Price</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Stock</th>  
                <th className="py-3 px-4 border-b font-bold text-[#663333]">BestSeller</th>
                <th className="py-3 px-4 border-b font-bold text-[#663333]">Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-[#f7e6ff] transition-all text-sm">
                    <td className="py-2 px-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#e0c3fc] shadow-md bg-[#fff7fa] flex items-center justify-center">
                        <img
                          src={product?.images[0]}
                          alt={product?.title}
                          className="object-cover w-full h-full"
                        />
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
                  <td colSpan="8" className="text-center py-8 text-[#663333] font-semibold text-sm">
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
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto mb-2 text-red-500"><path d="M12 9v4m0 4h.01" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2"/></svg>
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
            .then(() => {
              handleCloseEditModal();
            })
            .catch((error) => {
              console.error('Error updating product:', error);
            });
        }}
      />
    </>
  );
};

export default ProductTable;
