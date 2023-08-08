import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/pages.css';
import { Link } from 'react-router-dom';
import { usePose } from '../function/postcontext';

const baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/1Bcc9S-zQJeEirqOIvml2C3AMziyVFGvf4sMtVa3Ch6s/values/haka?key=AIzaSyA4PLe6OiOkD82M-dB9gyVaV3myLE0CBkg';
const data_number = 5;

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', right: '0px' }} onClick={onClick} />;
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block', background: 'black', left: '0px' }} onClick={onClick} />;
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const { pose } = usePose();
  const linkRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (pose === 'enter') {
      console.log('Go');
      if (linkRef.current) {
        linkRef.current.click();
        // resetPose();
      }
    } else if (pose === 'toright') {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
        // resetPose();
      }
    } else if (pose === 'toleft') {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
        // resetPose();
      }
    }
  }, [pose]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      // ヘッダーを含めた全てのデータ
      const data = response.data.values;

      // ヘッダー以外の情報のみを表示
      const data_values = data.slice(1, data_number);

      // ヘッダーの情報行のみを表示(idからurlまで)
      const h_data = response.data.values[0];
      // console.log(h_data);

      // (難易度激たかい)data_valuesとh_dataの配列を1つの辞書型にまとめる
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
      // console.log(about);
      const array_value = JSON.stringify(about);
      const abc = JSON.parse(array_value);

      //Jsonデータの中身で数値となる部分を「文字列から数値」に変換
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
      // console.log(result);

      // JsonデータをSearchに外部出力するためにuseStateで情報保持
      setBooks(data_result);
    });
  }, []);
  // console.log(books);

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
        {books.map((book) => {
          // console.log(book.bookId);
          return (
            <div key={book.id} className="slider-item">
              {/* <h2>{book.title}</h2> */}
              <Link
                to={{
                  pathname: `/book/${book.bookId}`,
                  state: { book: book }, // 全ての書籍データを渡します
                }}
                ref={linkRef}
              >
                <img src={`${process.env.PUBLIC_URL}/images/${book.bookId}.png`} alt={book.title} width="23%" />
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Books;
