import React from 'react';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', right: '0px' }} onClick={onClick}></div>;
};

export default SampleNextArrow;
