import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-5 ${
        hoverEffect ? 'glass-hover' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
