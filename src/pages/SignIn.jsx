import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import UseShowPassword from "../hooks/UseShowPassword";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 
import authImg from "../assets/authImg.jpg";

const SignIn = () => {
  const { login, loading } = useAuth();
  const { showPassword, handleShowPassword } = UseShowPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <div className="flex flex-col lg:flex-row items-stretch min-h-screen lg:h-[600px]">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:basis-1/2 relative w-full h-full overflow-hidden ">
        <img src={authImg} alt="auth" className="object-cover w-full h-full" />
      </div>

      {/* Right Form Section */}
      <div className="basis-full lg:basis-1/2 flex items-center justify-center h-full bg-opacity-10">
        <div className="p-6 md:p-8 rounded-lg w-full max-w-md h-full flex flex-col justify-center mx-auto">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
              <img src={logo} alt="company-logo" className="h-12 md:h-16" />
          </div>

          {/* Title */}
          <div className="flex justify-center mb-6">
            <span className="text-2xl md:text-4xl text-[#663333] font-semibold">
              Login to Continue
            </span>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6 text-[#663333]">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@mail.com"
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#663333] border border-[#663333]"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#663333] border border-[#663333]"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span className="absolute top-9 right-4 cursor-pointer">
                {showPassword ? (
                  <FaEye color="gray" size={20} onClick={handleShowPassword} />
                ) : (
                  <FaEyeSlash color="gray" size={20} onClick={handleShowPassword} />
                )}
              </span>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#663333] text-white  hover:bg-[#ffe1f0] hover:text-[#663333] cursor-pointer py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#663333] transition duration-300 font-medium border border-[#663333]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-3 border-gray-400 "></div>
                </div>
              ) : (
                "Login"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
