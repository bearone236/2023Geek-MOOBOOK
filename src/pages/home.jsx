import React, { useEffect, useRef } from 'react'; // useRefをインポートします
import { Link } from 'react-router-dom';
import '../style/pages.css';
import { usePose } from '../function/postcontext';

const Home = () => {
  const { pose } = usePose();
  const linkRef = useRef(null);

  useEffect(() => {
    if (pose === 'enter') {
      console.log('Go');
      if (linkRef.current) {
        linkRef.current.click();
        // resetPose();
      }
    }
  }, [pose]);

  return (
    <div className="home">
      {/* <div className="homeMenu" id="operation_button">
        <p>操作説明</p>
      </div> */}
      <div className="homeMenu" id="start_button">
        <Link to={{ pathname: '/book' }} style={{ textDecoration: 'none' }} ref={linkRef} className="homeMenu-images">
          <img src={`${process.env.PUBLIC_URL}/images/Home-logo.png`} alt="Home-logo" width="40%" />
          <p>手を挙げて🖐️</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
