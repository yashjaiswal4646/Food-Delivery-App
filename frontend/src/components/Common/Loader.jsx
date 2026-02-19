import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#f97316"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;