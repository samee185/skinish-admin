import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const DashboardCard = ({ cardImg, title, currentDate, amount, className }) => {
  return (
    <div
      className={clsx(
        "bg-white w-full lg:w-[280px] p-5 rounded-2xl shadow-lg border border-[#ffe1f0] transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-6">
        {/* Icon Container */}
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-[#ffe1f0] text-[#663333]">
          {cardImg}
        </div>

        {/* Text Content */}
        <div className="flex flex-col text-gray-800">
          <h3 className="text-md font-semibold text-[#663333]">{title}</h3>
          <p className="text-lg font-bold text-[#663333]">{amount}</p>
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            <span className="font-medium">{currentDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  cardImg: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  currentDate: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string
};

export default DashboardCard;
