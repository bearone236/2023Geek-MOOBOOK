import React from 'react';
// import CameraComponent from './camera';
import '../style/components.css';
import Camera from './camera';

const Header = () => {
  return (
    <div>
      <header className="header">
        <h1>MOOBOOK</h1>
        <div className="camera">
          {/* <CameraComponent /> */}
          <Camera />
        </div>
      </header>
    </div>
  );
};

export default Header;
