import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = 'text-yellow-400', size = 'base' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    base: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.base;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <FaStar className={`${color} ${starSize}`} />
            ) : value >= index - 0.5 ? (
              <FaStarHalfAlt className={`${color} ${starSize}`} />
            ) : (
              <FaRegStar className={`${color} ${starSize}`} />
            )}
          </span>
        ))}
      </div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;