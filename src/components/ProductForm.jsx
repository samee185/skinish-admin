import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  };

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
      (value) => value && value.length > 0
    ),
  });

  const handleSubmit = (values) => {
    console.log("Form Submitted", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#663333]">Add New Product</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Fill in the details below to add a new product to your store.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-2">
                <label className="block font-semibold text-[#663333] mb-1">Name</label>
                <Field
                  name="name"
                  placeholder="Product name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Brand */}
              <div>
                <label className="block font-semibold text-[#663333] mb-1">Brand</label>
                <Field
                  name="brand"
                  placeholder="Brand name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-[#663333] mb-1">Category</label>
                <Field
                  name="category"
                  placeholder="e.g. Electronics"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Price */}
              <div>
                <label className="block font-semibold text-[#663333] mb-1">Price</label>
                <Field
                  name="price"
                  type="number"
                  placeholder="₦0.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Count in Stock */}
              <div>
                <label className="block font-semibold text-[#663333] mb-1">Count in Stock</label>
                <Field
                  name="countInStock"
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="countInStock" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Images */}
              <div className="col-span-2">
                <label className="block font-semibold text-[#663333] mb-1">Images</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={(event) => setFieldValue("images", event.currentTarget.files)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#ffe1f0] focus:border-[#663333] transition"
                />
                <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Featured & Bestseller */}
              <div className="flex items-center space-x-3">
                <Field
                  type="checkbox"
                  name="featured"
                  className="w-5 h-5 text-[#663333] border-gray-300 rounded focus:ring-[#ffe1f0]"
                />
                <label className="text-[#663333] font-medium">Featured</label>
              </div>

              <div className="flex items-center space-x-3">
                <Field
                  type="checkbox"
                  name="bestseller"
                  className="w-5 h-5 text-[#663333] border-gray-300 rounded focus:ring-[#ffe1f0]"
                />
                <label className="text-[#663333] font-medium">Bestseller</label>
              </div>

              {/* Submit */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#663333] hover:bg-[#4d2626] text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                  Add Product
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
