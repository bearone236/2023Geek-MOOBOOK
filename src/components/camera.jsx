import React, { useEffect, useRef } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import { usePose } from '../function/postcontext';
import '../App.css';

const Camera = () => {
  const videoRef = useRef(null);
  // const outputRef = useRef(null);
  // const debugRef = useRef(null);
  const { setPose } = usePose();
  // const [gesture, setGesture] = useState(false);

  useEffect(() => {
    let prevX = null;
    let prevY = null;
    const threshold = 100;
    const distThreshold = 100;

    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      videoRef.current.srcObject = stream;

      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve(videoRef.current);
        };
      });
    }

    async function main() {
      const video = await setupCamera();
      video.play();

      const model = await handpose.load();

      // 手の検出を繰り返す
      setInterval(async () => {
        const predictions = await model.estimateHands(video, true);

        predictions.forEach((prediction) => {
          const landmarks = prediction.landmarks;
          const tip0 = landmarks[5];
          const tip1 = landmarks[6];
          const tip2 = landmarks[7];
          // console.log(landmarks[0][2]);

          //   const dist = Math.hypot(tip0[0] - tip1[0], tip0[1] - tip1[1]);
          //   debug.textContent = `dist: ${dist}`;
          const angle =
            (((tip0[0] - tip1[0]) * (tip2[0] - tip1[0]) + (tip0[1] - tip1[1]) * (tip2[1] - tip1[1]) + (tip0[2] - tip1[2]) * (tip2[2] - tip1[2])) /
              (Math.sqrt((tip0[0] - tip1[0]) ** 2 + (tip0[1] - tip1[1]) ** 2 + (tip0[2] - tip1[2]) ** 2) *
                Math.sqrt((tip2[0] - tip1[0]) ** 2 + (tip2[1] - tip1[1]) ** 2 + (tip2[2] - tip1[2]) ** 2))) *
            -1;
          const radian = Math.acos(angle);
          const degree = radian * (180 / Math.PI);
          console.debug(degree);
          // debugRef.current.textContent = `angle: ${angle}`;
          if (degree > 60) {
            // outputRef.current.textContent = '手が閉じています';
            console.log('手が閉じています');
            prevX = null;
            prevY = null;
            setPose('back');

            // setPose('enter');
            // setGesture(true);
          } else {
            // outputRef.current.textContent = '手が開いています';
            console.log('手が空いています');
            const data = Date();
            console.log(data);
            // setGesture(false);
            if (prevX && prevY) {
              // console.log('---------------------------');
              const x_dist = landmarks[0][0] - prevX;
              const y_dist = landmarks[0][1] - prevY;
              if (x_dist < -1 * threshold) {
                // Flip x-axis detection
                // outputRef.current.textContent += `, 手が左に移動しました`;
                console.log('手が左に移動しました');
                setPose('toright');
              } else if (x_dist > threshold) {
                // Flip}< prevX) { // Flip x-axis detection
                // outputRef.current.textContent += `, 手が右に移動しました`;
                console.log('手が右に移動しました');
                setPose('toleft');
              } else {
                // outputRef.current.textContent += ', 手は左右には動いていません';
                // console.log('手は左右には動いていません');
              }

              console.log(y_dist);

              if (y_dist < -1 * distThreshold) {
                // outputRef.current.textContent += ', 手が上に移動しました';
                console.log('手が上に移動しました');
                setPose('enter');
                // setGesture(true);
              } else if (y_dist > distThreshold) {
                // outputRef.current.textContent += ', 手が下に移動しました';
                console.log('手が下に移動しました');
              } else {
                // outputRef.current.textContent += ', 手は上下には動いていません';
                // console.log('手は上下に動いていません');
              }
            }

            prevX = landmarks[0][0];
            prevY = landmarks[0][1];
          }
          // console.log(gesture);
          console.log(prevX);
        });
      }, 1000);
    }

    main();
  });
  return (
    <div>
      {/* <video ref={videoRef} id="video" width="370" height="230" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }}></video> */}
      <video ref={videoRef} id="video" width="200" height="160" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }} className="camera"></video>
      {/* <p ref={outputRef} id="output" className="hidden"></p> */}
      {/* <p ref={debugRef} id="debug" className="hidden"></p> */}
    </div>
  );
};

export default Camera;
