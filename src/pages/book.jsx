import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { usePose } from '../function/postcontext';
import SampleNextArrow from '../components/sampleNextArrow';
import SamplePrevArrow from '../components/samplePrevArrow';
import '../style/pages.css';
import { Link, useParams } from 'react-router-dom';

const Book = () => {
  const sliderRef = useRef(null);
  const { pose } = usePose();
  const backRef = useRef(null);
  const { bookId } = useParams();

  useEffect(() => {
    if (pose === 'toright') {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    } else if (pose === 'toleft') {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
      }
    } else if (pose === 'back') {
      console.log('Back');
      if (backRef.current) {
        backRef.current.click();
      }
    }
  }, [pose]);

  const imageFiles = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: `book${index + 1}`,
    img: `${process.env.PUBLIC_URL}/pdfImages/${bookId}/${bookId}-${index + 1}.png`,
  }));

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

  return (
    <div className="Book">
      <div>
        <Slider {...settings} ref={sliderRef}>
          {imageFiles.map((item) => (
            <div key={item.id} className="pdf-images">
              <img src={item.img} width="85%" className="pdf-image" alt="items-images" />
            </div>
          ))}
        </Slider>
      </div>
      <Link to={{ pathname: '/' }} style={{ display: 'none' }} ref={backRef}></Link>
    </div>
  );
};

export default Book;
