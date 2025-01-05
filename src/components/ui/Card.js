// src/components/ui/Card.js
import React from 'react';
import CardContent from './CardContent';

const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 bg-gray-100 border-b">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <CardContent>{children}</CardContent>
    </div>
  );
};

export default Card;  // Default export

