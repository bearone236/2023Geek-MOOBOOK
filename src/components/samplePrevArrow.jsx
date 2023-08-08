import React from 'react';

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', left: '0px' }} onClick={onClick} />;
};

export default SamplePrevArrow;
