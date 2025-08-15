import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useProduct } from "../contexts/ProductContext";

const AddProductForm = () => {
  const initialValues = {
    name: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
    featured: false,
    bestseller: false,
    images: [],
    description: "",
  };
  const { createNewProduct, loading } = useProduct();
  const [formError, setFormError] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    brand: Yup.string().required("Brand is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .required("Price is required"),
    countInStock: Yup.number()
      .typeError("Stock count must be a number")
      .integer("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .required("Stock count is required"),
    images: Yup.mixed().test(
      "fileRequired",
      "At least one image is required",
      (value) => {
        if (!value) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (value instanceof FileList) return value.length > 0;
        return false;
      }
    ),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);
    try {
      // Convert FileList to array if needed
      let imagesArr = values.images;
      if (values.images instanceof FileList) {
        imagesArr = Array.from(values.images);
      }
      const submitValues = { ...values, images: imagesArr };
      await createNewProduct(submitValues);
      setFormSuccess("Product added successfully!");
      resetForm();
    } catch (err) {
      setFormError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#ffe1f0] via-[#fff7fa] to-[#f7e6ff]">
      <div className="w-full max-w-3xl bg-white/90 shadow-2xl rounded-3xl p-8 md:p-12 relative border border-[#f3d6e3]">
        {/* Decorative Accent */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-[#ffb6c1] via-[#e0c3fc] to-[#b2f7ef] rounded-full blur-lg opacity-60"></div>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#663333] tracking-tight flex items-center justify-center gap-2">
            <span>Add New Product</span>
            <span className="inline-block align-middle">
              {/* Product SVG icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M3 7.5V17a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0021 17V7.5" stroke="#663333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="4.5" width="18" height="3" rx="1.5" fill="#ffe1f0" stroke="#663333" strokeWidth="1.5"/></svg>
            </span>
          </h2>
          <p className="text-gray-500 mt-2 text-base font-medium">
            Fill in the details below to add a new product to your store.
          </p>
        </div>
        {formError && (
          <div className="text-red-600 text-center mb-4 font-semibold animate-pulse">{formError}</div>
        )}
        {formSuccess && (
          <div className="text-green-600 text-center mb-4 font-semibold animate-fade-in">{formSuccess}</div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="name" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 17v-6m0 0V7m0 4h4m-4 0H8" stroke="#663333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Product name"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="#663333" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Brand
                </label>
                <Field
                  id="brand"
                  name="brand"
                  placeholder="Brand name"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md"
                />
                <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="flex font-semibold text-[#663333] mb-2 items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" stroke="#663333" strokeWidth="1.5"/></svg>
                  Category
                </label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md"
                >
                  <option value="" disabled>Select category</option>
                  <option value="Face">Face</option>
                  <option value="Asian">Asian</option>
                  <option value="Body and Bath">Body and Bath</option>
                  <option value="Cleanser and Toners">Cleanser and Toners</option>
                  <option value="Haircare">Haircare</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 6v12m0 0c-2.5 0-4.5-2-4.5-4.5S9.5 9 12 9s4.5 2 4.5 4.5S14.5 18 12 18z" stroke="#663333" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Price
                </label>
                <Field
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₦0.00"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Count in Stock */}
              <div>
                <label htmlFor="countInStock" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="3" stroke="#663333" strokeWidth="1.5"/></svg>
                  Count in Stock
                </label>
                <Field
                  id="countInStock"
                  name="countInStock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md"
                />
                <ErrorMessage name="countInStock" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Images */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="images" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#663333" strokeWidth="1.5"/><circle cx="8" cy="12" r="2" fill="#b2f7ef"/></svg>
                  Images
                </label>
                <div className="relative w-full">
                  <label htmlFor="images" className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0c3fc] rounded-xl px-5 py-8 bg-white cursor-pointer transition-all hover:border-[#b2f7ef] hover:bg-[#f7e6ff] focus-within:border-[#663333]">
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-2 text-[#b2f7ef]"><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" stroke="#b2f7ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="7" width="18" height="10" rx="2" stroke="#e0c3fc" strokeWidth="1.5"/><circle cx="8" cy="12" r="2" fill="#b2f7ef"/></svg>
                    <span className="text-[#663333] font-medium">Click or drag images here to upload</span>
                    <span className="text-xs text-gray-400 mt-1">(You can select multiple images)</span>
                    <input
                      id="images"
                      type="file"
                      name="images"
                      multiple
                      onChange={(event) => {
                        setFieldValue("images", event.currentTarget.files);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-describedby="images-error"
                    />
                  </label>
                </div>
                <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-1" id="images-error" />
                {/* Image Preview */}
                {values.images && values.images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {Array.from(values.images).map((file, idx) => (
                      <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-[#e0c3fc] shadow-sm bg-[#fff7fa] flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="description" className="font-semibold text-[#663333] mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#663333" strokeWidth="1.5"/><path d="M8 10h8M8 14h5" stroke="#663333" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:border-[#663333] transition-all shadow-sm hover:shadow-md resize-none"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Featured & Bestseller */}
              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-8 mt-2">
                <div className="flex items-center space-x-3">
                  <Field
                    id="featured"
                    type="checkbox"
                    name="featured"
                    checked={!!values.featured}
                    className="w-5 h-5 text-[#663333] border-[#e0c3fc] rounded focus:ring-[#b2f7ef] accent-[#b2f7ef]"
                  />
                  <label htmlFor="featured" className="text-[#663333] font-medium flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="#663333" strokeWidth="1.2"/></svg>
                    Featured
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Field
                    id="bestseller"
                    type="checkbox"
                    name="bestseller"
                    checked={!!values.bestseller}
                    className="w-5 h-5 text-[#663333] border-[#e0c3fc] rounded focus:ring-[#b2f7ef] accent-[#b2f7ef]"
                  />
                  <label htmlFor="bestseller" className="text-[#663333] font-medium flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 2v20m10-10H2" stroke="#663333" strokeWidth="1.2"/></svg>
                    Bestseller
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ffb6c1] via-[#e0c3fc] to-[#b2f7ef] hover:from-[#e0c3fc] hover:to-[#ffb6c1] text-[#663333] py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#b2f7ef] focus:ring-offset-2 flex items-center justify-center gap-2 text-lg"
                  disabled={isSubmitting || loading}
                >
                  {(isSubmitting || loading) ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#663333" strokeWidth="2" opacity="0.2"/><path d="M12 2a10 10 0 0110 10" stroke="#663333" strokeWidth="2"/></svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#663333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Add Product
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProductForm;
