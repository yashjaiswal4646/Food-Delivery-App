import React from 'react';

const Card = ({ children, className = '', padding = true, ...props }) => {
  const classes = [
    'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200',
    padding ? 'p-6' : '',
    className
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;