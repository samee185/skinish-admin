 import React from 'react';
 import logo from "../assets/logo.png";
 import { useAuth } from '../contexts/AuthContext';
 const Navbar = () => {
  const { logout } = useAuth();
   return (
     <>
       <nav className="bg-[#ffe1f0] fixed w-[100%] px-4 py-2 md:px-8 md:py-2 flex items-center justify-between z-20 ">
         <div>
           <img src={logo} alt="Skinish-Logo" className="h-12 md:h-16" />
         </div>

         <div className="">
           <span className="py-[6px] px-6 text-[14px] md:text-[16px] text-[#663333] rounded-[30px] shadow shadow-[#663333] border border-[#663333] transition duration-900 cursor-pointer hover:font-bold " onClick={logout}>
             logout
           </span>
         </div>
       </nav>
     </>
   );
 }
 
 export default Navbar;