// src/components/ui/CardContent.js
import React from 'react';

const CardContent = ({ children }) => {
  return (
    <div className="p-4">  {/* Reduced padding */}
      {children}
    </div>
  );
};

export default CardContent;

