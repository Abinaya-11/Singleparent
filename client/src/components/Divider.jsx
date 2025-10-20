import React from 'react';

const Divider = ({ className = "" }) => {
  return (
    <div className={`border-t border-gray-200 ${className}`}></div>
  );
};

export default Divider;