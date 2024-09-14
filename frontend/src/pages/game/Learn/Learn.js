import React, { useEffect, useState } from 'react';
import { startModule, renderPrediction, renderUpload, handleVideoUpload, loadLocalVideo } from '../src/main';
import '../../../assets/css/learn.css';

const Learn = () => {
  const [uploadView, setUploadView] = useState(false);

  useEffect(() => {
    startModule().then(() => {
      //renderPrediction(); // renders self view
      renderUpload(setUploadView); // renders upload view
      loadLocalVideo();
    })
  }, []);

  return (
    <>
      <div id="main">
        <div className="container">
          <div className="canvas-wrapper">
            <canvas id="output" style={{position: "fixed"}}> </canvas>
            <video
              id="video"
              playsInline
              style={{
                WebkitTransform: 'scaleX(-1)',
                transform: 'scaleX(-1)',
                visibility: 'hidden',
                width: 'auto',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </div>
      {uploadView && 
        <>
          <div id="upload_panel">
           <input type="file" accept=".mp4" onChange={handleVideoUpload} />
          </div>
        </>
      }
    </>
  );
};

export default Learn;