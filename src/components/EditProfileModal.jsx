import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Male",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#ffe1f0]/90 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-md rounded-2xl shadow-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 text-[#663333] relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#663333] hover:text-red-600 transition"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-lg font-semibold">Address: </p>
              
              <input
                type="text"
                name="Street"
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Main St"
                className="w-full p-3 rounded-lg bg-white/20 focus:outline-none border border-[#663333] placeholder-[#663333]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 rounded-lg bg-white/20 focus:outline-none border border-[#663333] placeholder-[#663333]"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Any State"
                  className="w-full p-3 rounded-lg bg-white/20 focus:outline-none border border-[#663333] placeholder-[#663333]"
                />
              </div>

              <p className="text-lg font-semibold">Phone Number: </p>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 80 123 4567"
                className="w-full p-3 rounded-lg bg-white/20 focus:outline-none border border-[#663333] placeholder-[#663333]"
              />

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 text-[#ffe1f0]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] border border-[#663333] hover:font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#663333] hover:font-bold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditProfileModal;