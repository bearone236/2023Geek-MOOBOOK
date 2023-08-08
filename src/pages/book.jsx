import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/pages.css';
import { usePose } from '../function/postcontext';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', right: '0px' }} onClick={onClick} />;
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', left: '0px' }} onClick={onClick} />;
};

const Book = () => {
  const sliderRef = useRef(null);
  const { pose } = usePose();

  useEffect(() => {
    if (pose === 'toright') {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
        // console.log(pose);
        // resetPose();
      }
    } else if (pose === 'toleft') {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
        // resetPose();
      }
    }
  }, [pose]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '100px',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const items = [
    { id: '1', title: 'book1', img: `${process.env.PUBLIC_URL}/pdfImages/1001-1.png` },
    { id: '2', title: 'book4', img: `${process.env.PUBLIC_URL}/pdfImages/1001-4.png` },
    { id: '3', title: 'book5', img: `${process.env.PUBLIC_URL}/pdfImages/1001-3.png` },
    { id: '4', title: 'book6', img: `${process.env.PUBLIC_URL}/pdfImages/1001-2.png` },
  ];

  return (
    <div className="Book">
      <div>
        <Slider {...settings} ref={sliderRef}>
          {items &&
            items.map((item) => {
              return (
                <div key={item.id} className="pdf-images">
                  <img src={item.img} width="85%" className="pdf-image" alt="items-images" />
                </div>
              );
            })}
        </Slider>
      </div>
    </div>
  );
};

export default Book;
