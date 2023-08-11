import React, { useEffect, useRef, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import { usePose } from '../function/postcontext';
import '../App.css';

const Camera = () => {
  const videoRef = useRef(null);
  const { setPose } = usePose();
  const [lastPoseTimestamp, setLastPoseTimestamp] = useState(0);

  useEffect(() => {
    let model = null;

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

      model = await handpose.load();

      let prevTimestamp = null;
      let prevX = null;
      let prevY = null;
      const speedThreshold = 0.1; // 速度の閾値（適宜調整）
      const positionChangeThreshold = 5; // 手の位置が変化したかどうかを判定するための閾値

      function hasPositionChanged(prevX, prevY, newX, newY) {
        const dx = prevX - newX;
        const dy = prevY - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= positionChangeThreshold;
      }

      const debounceTime = 1000; // デバウンス時間（ミリ秒）
      let debounceTimer = null;

      const interval = setInterval(async () => {
        if (!model) return;

        const predictions = await model.estimateHands(video, true);

        predictions.forEach((prediction) => {
          const landmarks = prediction.landmarks;
          const tip0 = landmarks[5];

          const currentTimestamp = Date.now();

          if (prevTimestamp !== null) {
            const x_dist = tip0[0] - prevX;
            const y_dist = tip0[1] - prevY;
            const timeElapsed = currentTimestamp - prevTimestamp;

            const x_speed = x_dist / timeElapsed;
            const y_speed = y_dist / timeElapsed;

            if (Math.abs(x_speed) > speedThreshold && hasPositionChanged(prevX, prevY, tip0[0], tip0[1])) {
              if (x_speed > 0) {
                console.log('手が右に移動しました');
                if (!debounceTimer && currentTimestamp - lastPoseTimestamp >= 1000) {
                  debounceTimer = setTimeout(() => {
                    setPose('toleft');
                    setLastPoseTimestamp(currentTimestamp);
                    debounceTimer = null;
                  }, debounceTime);
                }
              } else {
                console.log('手が左に移動しました');
                if (!debounceTimer && currentTimestamp - lastPoseTimestamp >= 1000) {
                  debounceTimer = setTimeout(() => {
                    setPose('toright');
                    setLastPoseTimestamp(currentTimestamp);
                    debounceTimer = null;
                  }, debounceTime);
                }
              }
            }

            if (Math.abs(y_speed) > speedThreshold && hasPositionChanged(prevX, prevY, tip0[0], tip0[1])) {
              if (y_speed > 0) {
                console.log('手が下に移動しました');
              } else {
                console.log('手が上に移動しました');
                if (!debounceTimer && currentTimestamp - lastPoseTimestamp >= 1000) {
                  debounceTimer = setTimeout(() => {
                    setPose('enter');
                    setLastPoseTimestamp(currentTimestamp);
                    debounceTimer = null;
                  }, debounceTime);
                }
              }
            }
          }

          prevX = tip0[0];
          prevY = tip0[1];
          prevTimestamp = currentTimestamp;
        });
      }, 1000); // 1秒に1回の間隔に変更

      return () => {
        clearInterval(interval);
      };
    }

    main();
  }, [setPose, lastPoseTimestamp]);

  return (
    <div>
      <video ref={videoRef} id="video" width="370" height="230" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }}></video>
    </div>
  );
};

export default Camera;
