// books.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import { usePose } from '../function/postcontext';
import SampleNextArrow from '../components/sampleNextArrow';
import SamplePrevArrow from '../components/samplePrevArrow';
import '../style/pages.css';

const baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/1Bcc9S-zQJeEirqOIvml2C3AMziyVFGvf4sMtVa3Ch6s/values/haka?key=AIzaSyA4PLe6OiOkD82M-dB9gyVaV3myLE0CBkg';
const data_number = 7;

const Books = () => {
  const [books, setBooks] = useState([]);
  const { pose } = usePose();
  const linkRef = useRef(null);
  const sliderRef = useRef(null);
  const backRef = useRef(null);
  useEffect(() => {
    if (pose === 'enter') {
      console.log('Go');
      if (linkRef.current) {
        linkRef.current.click();
      }
    } else if (pose === 'toright') {
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

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      const data = response.data.values;
      const data_values = data.slice(1, data_number);

      const h_data = response.data.values[0];

      const arrayToMap = (function () {
        function mapfn(data_values) {
          for (var i = 0, l = this.length, obj = Object.create(null); i < l; ++i) {
            if (data_values.hasOwnProperty(i)) {
              obj[this[i]] = data_values[i];
            }
          }
          return obj;
        }

        return function arrayToMap(s_data, h_data) {
          return s_data.map(mapfn, h_data);
        };
      })();

      const about = arrayToMap(data_values, h_data);
      const array_value = JSON.stringify(about);
      const abc = JSON.parse(array_value);

      for (var i = 0; i < abc.length; i++) {
        var obj = abc[i];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
            obj[prop] = +obj[prop];
          }
        }
      }
      const result = JSON.stringify(abc, null, 2);
      const data_result = JSON.parse(result);

      setBooks(data_result);
    });
  }, []);

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
    <div className="books">
      <Slider {...settings} ref={sliderRef}>
        {books.map((book) => (
          <div key={book.id} className="slider-item">
            <Link
              to={{
                pathname: `/book/${book.bookId}`,
                state: { book: book },
              }}
              ref={linkRef}
            >
              <img src={`${process.env.PUBLIC_URL}/images/${book.bookId}.png`} alt={book.title} width="25%" />
            </Link>
          </div>
        ))}
      </Slider>
      <Link to={{ pathname: '/' }} style={{ display: 'none' }} ref={backRef}></Link>
    </div>
  );
};

export default Books;
