import React, { useState, useMemo } from "react";
import { useOrders } from "../context/OrderContext";
import { useProduct } from "../context/ProductContext";

const AddOrderModal = ({ isOpen, onClose }) => {
  const {
    selectedProducts,
    addProduct,
    removeProduct,
    updateQuantity,
    calculateTotal,
    addOrderByAdmin,
    loading,
  } = useOrders();

  const { products } = useProduct();
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [shippingInfo, setShippingInfo] = useState({ address: "", city: "", state: "", phone: "" });
  const [paymentInfo, setPaymentInfo] = useState({ method: "", status: "", transactionId: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term and exclude already selected products
  const filteredProducts = useMemo(() => {
    return products.filter(
      p =>
        !selectedProducts.some(sp => sp.productId === p._id) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, selectedProducts, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Order</h2>

        {/* Customer Info */}
        <input
          type="text"
          placeholder="Customer Name"
          value={customerInfo.name}
          onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerInfo.email}
          onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
          className="border p-2 w-full mb-4"
        />

        {/* Shipping Info */}
        <h3 className="font-semibold mb-2">Shipping Info</h3>
        {["address","city","state","phone"].map(field => (
          <input
            key={field}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={shippingInfo[field]}
            onChange={e => setShippingInfo({ ...shippingInfo, [field]: e.target.value })}
            className="border p-2 w-full mb-2"
          />
        ))}

        {/* Payment Info */}
        <h3 className="font-semibold mb-2">Payment Info</h3>
        {["method","status","transactionId"].map(field => (
          <input
            key={field}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={paymentInfo[field]}
            onChange={e => setPaymentInfo({ ...paymentInfo, [field]: e.target.value })}
            className="border p-2 w-full mb-2"
          />
        ))}

        {/* Product Selector */}
        <h3 className="font-semibold mt-4 mb-2">Select Products</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <div className="max-h-40 overflow-y-auto border p-2 mb-4">
          {filteredProducts.length === 0 && <p className="text-gray-500">No products found</p>}
          {filteredProducts.map(p => (
            <div
              key={p._id}
              className="flex justify-between items-center p-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => addProduct(p)}
            >
              <span>{p.name}</span>
              <span>₦{p.price}</span>
            </div>
          ))}
        </div>

        {/* Selected Products */}
        <h3 className="font-semibold mb-2">Selected Products</h3>
        {selectedProducts.length === 0 && <p className="text-gray-500 mb-2">No products selected</p>}
        {selectedProducts.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center border p-2 rounded">
            <input type="text" value={p.name} readOnly className="border p-1 w-1/3 bg-gray-100" />
            <input type="number" min={1} value={p.quantity} onChange={e => updateQuantity(i, Number(e.target.value))} className="border p-1 w-1/6" />
            <input type="number" value={p.price} readOnly className="border p-1 w-1/6 bg-gray-100" />
            <button onClick={() => removeProduct(i)} className="text-red-500">X</button>
          </div>
        ))}

        <div className="font-semibold mb-4">Total: ₦{calculateTotal()}</div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button
            onClick={() => addOrderByAdmin(customerInfo, shippingInfo, paymentInfo, onClose)}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;
