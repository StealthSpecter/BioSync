// src/components/ui/Alert.js
import React from 'react';

const Alert = ({ message }) => {
  return (
    <div className="bg-yellow-200 text-yellow-800 p-4 rounded-lg">
      {message}
    </div>
  );
};

export default Alert;

