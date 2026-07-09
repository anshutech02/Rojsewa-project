import React from "react";

const Card = ({
  children,
  className = "",
  hoverEffect = true,
  onClick,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`glass rounded-2xl p-5 ${
        hoverEffect ? "glass-hover" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;