import React,{useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import EditProductModal from '../components/EditProductModal';
import EditProductImagesModal from '../components/EditImageModal';
const ProductDetails = () => {
  const { productId } = useParams();
  const { products, updateProduct, updateProductImages } = useProduct();
 
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  


  const product = products?.find((p) => p._id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe1f0] via-[#fff7fa] to-[#f7e6ff]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-[#ffe1f0]">
          <h2 className="text-2xl font-bold text-[#663333] mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you are looking for does not exist.</p>
          <button className="mt-6 px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe1f0] via-[#fff7fa] to-[#f7e6ff] px-4 py-10 mt-12">
      <div className="w-full max-w-4xl bg-white/90 shadow-2xl rounded-3xl p-10 md:p-16 relative border border-[#f3d6e3]">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-[#e0c3fc] shadow-md bg-[#fff7fa] flex items-center justify-center">
            <div className="relative w-64 h-64 cursor-pointer">
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full rounded-2xl border-2 border-[#e0c3fc] shadow-lg transition-transform transform hover:scale-105"
              onClick={() => setShowEditImageModal(true)}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-2xl pointer-events-none">
              <div className="flex items-center gap-2 bg-[#b2f7ef] bg-opacity-90 text-[#663333] font-semibold px-3 py-1 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16.5 3.5l4 4-11 11H5.5v-4L16.5 3.5z" />
                </svg>
                <span>Click to Edit Images</span>
              </div>
            </div>
          </div>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-[#663333] mb-4 flex items-center gap-3 capitalize">
              {product.name}
              <button className="ml-2 bg-[#b2f7ef] hover:bg-[#e0c3fc] text-[#663333] rounded-lg p-2 transition" onClick={handleEditClick}>
                <PencilSquareIcon className="w-7 h-7" />
              </button>
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="bg-[#ffe1f0] text-[#663333] px-3 py-1 rounded-full font-semibold text-sm">Brand: {product.brand}</span>
              <span className="bg-[#b2f7ef] text-[#663333] px-3 py-1 rounded-full font-semibold text-sm">Category: {product.category}</span>
              <span className="bg-[#e0c3fc] text-[#663333] px-3 py-1 rounded-full font-semibold text-sm">Stock: {product.countInStock}</span>
              <span className={`px-3 py-1 rounded-full font-semibold text-sm ${product.bestseller ? 'bg-[#b2f7ef] text-[#663333]' : 'bg-gray-200 text-gray-500'}`}>BestSeller: {product.bestseller ? 'Yes' : 'No'}</span>
            </div>
            <p className="text-2xl font-bold text-[#663333] mb-4">₦{product.price}</p>
            <div className="bg-[#fff7fa] border border-[#e0c3fc] rounded-xl p-6 mb-4">
              <h3 className="text-lg font-bold text-[#663333] mb-2">Description</h3>
              <p className="text-base text-[#663333]">{product.description}</p>
            </div>
            {/* Add more product info or features here for a richer layout */}
            <div className="flex gap-4 mt-6">
              <button className="px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition" onClick={() => navigate(-1)}>Go Back</button>
              <button className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition" onClick={handleEditClick}>Edit Product</button>
            </div>
          </div>
        </div>
      </div>
      <EditProductModal 
        show={showEditModal} 
        product={editProduct} 
        onClose={handleCloseEditModal}
        onUpdate={(updatedProduct) => {
          
          updateProduct(product._id, updatedProduct)
            .then(() => {
              handleCloseEditModal();
            })
            .catch((err) => {
              console.error('Error updating product from details page:', err);
            });
        }}
      />

      {showEditImageModal && (
        <EditProductImagesModal
          show={showEditImageModal}
          onClose={() => setShowEditImageModal(false)}
          product={product}
          onUpdateImages={updateProductImages}
        />
      )}
       
        
    </div>
  );
};

export default ProductDetails;