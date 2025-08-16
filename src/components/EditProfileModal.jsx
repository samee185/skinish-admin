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
            <h2 className="text-3xl font-bold mb-6 text-[#663333]">Edit Profile</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <label className="block font-semibold text-[#663333] mb-1 text-lg">Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Main St."
                className="w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base"
                />
              </div>
              <label className="block font-semibold text-[#663333] mb-1 text-lg">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 80 123 4567"
                className="w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base"
              />
              {/* Actions */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition text-lg"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition text-lg"
                >
                  SAVE CHANGES
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