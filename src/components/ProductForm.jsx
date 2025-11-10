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
    discountedPrice: "",
    countInStock: "",
    featured: false,
    bestseller: false,
    sku: "",
    size: "",
    target: "",
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
    discountedPrice: Yup.number()
      .typeError("Discounted price must be a number")
      .min(0, "Discounted price cannot be negative")
      .max(Yup.ref("price"), "Discounted price cannot exceed original price")
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    countInStock: Yup.number()
      .typeError("Stock count must be a number")
      .integer("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .required("Stock count is required"),
    sku: Yup.string().required("SKU is required"),
    size: Yup.string().required("Size is required"),
    target: Yup.string().required("Target audience is required"),
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
                <label htmlFor="name" className="font-semibold text-[#663333] mb-2">Name</label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Product name"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="font-semibold text-[#663333] mb-2">SKU</label>
                <Field
                  id="sku"
                  name="sku"
                  placeholder="Product SKU"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="sku" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="font-semibold text-[#663333] mb-2">Brand</label>
                <Field
                  id="brand"
                  name="brand"
                  placeholder="Brand name"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Category (input) */}
              <div>
                <label htmlFor="category" className="font-semibold text-[#663333] mb-2">Category</label>
                <Field
                  id="category"
                  name="category"
                  placeholder="Category"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="font-semibold text-[#663333] mb-2">Price (₦)</label>
                <Field
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₦0.00"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Discounted Price */}
              <div>
                <label htmlFor="discountedPrice" className="font-semibold text-[#663333] mb-2">Discounted Price (₦)</label>
                <Field
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty if no discount"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="discountedPrice" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Count in Stock */}
              <div>
                <label htmlFor="countInStock" className="font-semibold text-[#663333] mb-2">Count in Stock</label>
                <Field
                  id="countInStock"
                  name="countInStock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="countInStock" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Size */}
              <div>
                <label htmlFor="size" className="font-semibold text-[#663333] mb-2">Size</label>
                <Field
                  id="size"
                  name="size"
                  placeholder="Size "
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="size" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Target */}
              <div>
                <label htmlFor="target" className="font-semibold text-[#663333] mb-2">Target </label>
                <Field
                  id="target"
                  name="target"
                  placeholder="Target (e.g., nourishing, brightening)"
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3"
                />
                <ErrorMessage name="target" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Images */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="images" className="font-semibold text-[#663333] mb-2">Images</label>
                <div className="relative w-full">
                  <label htmlFor="images" className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0c3fc] rounded-xl px-5 py-8 bg-white cursor-pointer">
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
                    />
                  </label>
                </div>
                <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-1" />
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
                <label htmlFor="description" className="font-semibold text-[#663333] mb-2">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full border border-[#e0c3fc] rounded-xl px-5 py-3 resize-none"
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
                  />
                  <label htmlFor="featured" className="text-[#663333] font-medium">Featured</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Field
                    id="bestseller"
                    type="checkbox"
                    name="bestseller"
                    checked={!!values.bestseller}
                  />
                  <label htmlFor="bestseller" className="text-[#663333] font-medium">Bestseller</label>
                </div>
              </div>

              {/* Submit */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ffb6c1] via-[#e0c3fc] to-[#b2f7ef] hover:from-[#e0c3fc] hover:to-[#ffb6c1] text-[#663333] py-3 rounded-xl font-bold transition-all"
                  disabled={isSubmitting || loading}
                >
                  {(isSubmitting || loading) ? "Adding..." : "Add Product"}
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
