import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { usePose } from '../function/postcontext';
import SampleNextArrow from '../components/sampleNextArrow';
import SamplePrevArrow from '../components/samplePrevArrow';
import '../style/pages.css';
import { Link } from 'react-router-dom';

const Book = () => {
  const sliderRef = useRef(null);
  const { pose } = usePose();
  const backRef = useRef(null);

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
    } else if (pose === 'back') {
      console.log('Back');
      if (backRef.current) {
        backRef.current.click();
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
      <Link to={{ pathname: '/' }} style={{ display: 'none' }} ref={backRef}></Link>
    </div>
  );
};

export default Book;
