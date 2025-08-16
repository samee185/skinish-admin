import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUser } from "../contexts/UserContext";
import { address } from "framer-motion/client";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const { updateUserProfile, getUserProfile } = useUser();
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    phone: user?.phone || "",  
    address:{
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
    }
  };

  const validationSchema = Yup.object({
    phone: Yup.string().required("Phone number is required."),
    address: Yup.object({
      street: Yup.string().required("Street address is required."),
      city: Yup.string().required("City is required."),
      state: Yup.string().required("State is required."),
    }),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setSuccess("");
    try {
      await updateUserProfile(values);
      await getUserProfile(); 
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrors({ form: err?.message || "Failed to update profile." });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-4 text-left">
                  {/* Address */}
                  <label className="block font-semibold text-[#663333] mb-1 text-lg">
                    Address
                  </label>
                  <Field
                    type="text"
                    name="address.street"
                    placeholder="123 Main St."
                    className={`w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base ${
                      errors.address?.street ? "border-red-400" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="address.street"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Field
                        type="text"
                        name="address.city"
                        placeholder="City"
                        className={`w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base ${
                          errors.address?.city ? "border-red-400" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="address.city"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="address.state"
                        placeholder="State"
                        className={`w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base ${
                          errors.address?.state ? "border-red-400" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="address.state"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <label className="block font-semibold text-[#663333] mb-1 text-lg">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="+234 80 123 4567"
                    className={`w-full p-3 rounded-xl bg-white/20 focus:outline-none border border-[#e0c3fc] placeholder-[#663333] text-base ${
                      errors.phone ? "border-red-400" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />

                  {/* Actions */}
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg bg-[#ffe1f0] text-[#663333] font-bold border border-[#ffe1f0] hover:bg-[#f7e6ff] transition text-lg"
                      disabled={isSubmitting || loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-[#b2f7ef] text-[#663333] font-bold border border-[#b2f7ef] hover:bg-[#e0c3fc] transition text-lg"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditProfileModal;