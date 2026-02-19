import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const Error = ({ message = 'Something went wrong!', retry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FaExclamationTriangle className="mb-4 text-5xl text-red-500" />
      <h3 className="mb-2 text-xl font-semibold text-gray-800">Oops!</h3>
      <p className="mb-4 text-gray-600">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;