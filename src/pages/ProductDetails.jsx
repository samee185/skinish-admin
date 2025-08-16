import React,{useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import EditProductModal from '../components/EditProductModal';

const ProductDetails = () => {
  const { productId } = useParams();
  const { products } = useProduct();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

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
            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
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
      <EditProductModal show={showEditModal} product={editProduct} onClose={handleCloseEditModal} />
    </div>
  );
};

export default ProductDetails;