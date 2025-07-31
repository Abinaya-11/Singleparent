import React from "react";

const Button = ({ text, onClick, type = "button", variant = "primary", icon = null }) => {
  const baseStyles = "font-semibold py-2 rounded-md w-full flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#ecb129] text-white",
    outline: "bg-white text-[#ecb129] border border-[#ecb129]",
    google: "bg-white border text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {icon && <img src={icon} alt="icon" className="w-5 h-5" />}
      {text}
    </button>
  );
};

export default Button;
