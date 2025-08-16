import React from "react";
import { useProduct } from "../contexts/ProductContext"; 
import {
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
const ProductTable = () => {
  const { products, deleteProduct } = useProduct();

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
          <table className="min-w-full bg-white/90 rounded-2xl">
            <thead>
              <tr className="w-full bg-gradient-to-r from-[#ffe1f0] via-[#e0c3fc] to-[#b2f7ef] text-left">
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Image</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Name</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Brand</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Category</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Price</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Stock</th>  
                <th className="py-4 px-6 border-b font-bold text-[#663333]">BestSeller</th>
                <th className="py-4 px-6 border-b font-bold text-[#663333]">Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-[#f7e6ff] transition-all">
                    <td className="py-3 px-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#e0c3fc] shadow-md bg-[#fff7fa] flex items-center justify-center">
                        <img
                          src={product?.images[0]}
                          alt={product?.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-6 font-semibold text-[#663333] max-w-[140px] truncate" title={product?.name}>{product?.name}</td>
                    <td className="py-3 px-6 text-[#663333]">{product?.brand}</td>
                    <td className="py-3 px-6 text-[#663333]">{product?.category}</td>
                    <td className="py-3 px-6 text-[#663333] font-bold">{`₦${product?.price}`}</td>
                    <td className="py-3 px-6 text-[#663333]">{product?.countInStock}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${product?.bestseller ? 'bg-[#b2f7ef] text-[#663333]' : 'bg-gray-200 text-gray-500'}`}>{product?.bestseller ? "Yes" : "No"}</span>
                    </td>
                    <td className="py-3 px-6 flex gap-2 items-center">
                      <button
                        className="bg-[#e0c3fc] hover:bg-[#b2f7ef] text-[#663333] font-bold px-4 py-2 rounded-lg shadow transition-all border border-[#e0c3fc] flex items-center gap-1"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-[#ffe1f0] hover:bg-red-200 text-red-600 font-bold px-4 py-2 rounded-lg shadow transition-all border border-[#ffe1f0] flex items-center gap-1"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <TrashIcon className="w-5 h-5" /> 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-[#663333] font-semibold">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
