import React from 'react';
// import CameraComponent from './camera';
import '../style/components.css';
import Camera from './camera';

const Header = () => {
  return (
    <div>
      <header className="header">
        <div className="title-logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/MOOBOOK.png`}
            alt="MOOBOOK"
            style={{ width: '18%', height: '100%' }}
            onselectstart="return false;"
            onmousedown="return false;"
          />
        </div>
        <div className="camera">
          {/* <CameraComponent /> */}
          <Camera />
        </div>
      </header>
    </div>
  );
};

export default Header;
