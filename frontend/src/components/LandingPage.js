import React, { useState } from 'react';
import Dance1 from '../assets/images/Dance1.png';
import Dance2 from '../assets/images/Dance2.png';
import Dance3 from '../assets/images/Dance3.png';
import image from '../assets/images/dancer.png';
import repeatA from '../assets/images/repeatA.png';
import repeatB from '../assets/images/repeatB.png';
import '../assets/css/landing.css';

function MainPage() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [loading, setLoading] = useState(false);
  const screenWidth = window.innerWidth;
  const repeatWidth = 9.8;
  const overlap = 0.08;
  const numRepeats = Math.ceil(screenWidth / (repeatWidth * 2 - overlap));

  const handleYoutubeLinkChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  const handleYoutubeLinkSubmit = (e) => {
    console.log("Submitting YouTube link...");
    if (youtubeLink) {  
      const apiUrl = 'http://localhost:5000/download';
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeLink }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoading(false);
          setYoutubeLink(''); 
        });
      setLoading(true);
    }
  };

  const handleImageButtonClick = (link) => {
    window.open(link, '_blank');
    setLoading(true);
  };

  return (
    <main className="main-page" style={loading ? { background: 'black' } : {}}>
      {loading ? (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    }}
  >
    <div className="loader"></div>
    <div
      style={{
        fontSize: '36px',
        color: 'white',
        marginTop: '20px',
        fontfamily: "san-sarif",
        fontWeight: "500",
        fontstyle: "normal"
      }}
    >
      Processing Video
    </div>
  </div>
) : (
        <>
          <div className="header">
            <header> Dance </header>
            <header> Teacher </header>
          </div>

          <div className="input-container">
            <input
              type="text"
              placeholder="Enter YouTube link"
              className="youtube-input-field"
              value={youtubeLink}
              onChange={handleYoutubeLinkChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleYoutubeLinkSubmit(e);
                }
              }}
            />
            
            <div style={{ margin: '0 10px', fontSize: '18px', color: 'white', alignSelf: 'center', fontFamily: "Roboto", fontWeight: "500", fontStyle: "normal" }}>OR</div>
            <label className="mp4-input-field" htmlFor="mp4-input">
              Choose MP4 File
            </label>
            <input
              type="file"
              accept="video/mp4"
              id="mp4-input"
              className="mp4-input-hidden"
            />
          </div>
          
          <div className="image-button-container">
            <div style={{ textAlign: 'center', color: 'white', fontSize: '18px', marginBottom: '10px', fontFamily: "Roboto", fontWeight: "500", fontStyle: "normal"}}>
              OR CHOOSE A SAMPLE
            </div>
            <div className="image-buttons">
              <img src={Dance1} alt="Button 1" className="image-button" onClick={() => handleImageButtonClick('https://www.youtube.com/watch?v=9TWj9I3CKzg')} />
              <img src={Dance2} alt="Button 2" className="image-button" onClick={() => handleImageButtonClick('https://www.youtube.com/watch?v=wYzGtkcttVE')} />
              <img src={Dance3} alt="Button 3" className="image-button" onClick={() => handleImageButtonClick('https://www.youtube.com/watch?v=8dmGTNxYGsE')} />
            </div>
          </div>

          <img
            src={image}
            alt="Dancer"
            style={{ width: '30%', position: 'fixed', bottom: '0px', left: '0px', borderRadius: '40% 40% 0 0' }}
          />
          {[...Array(numRepeats).keys()].map((index) => (
            <React.Fragment key={index}>
              <img
                src={index % 2 === 0 ? repeatB : repeatA}
                alt="Repeat"
                style={{
                  width: `${repeatWidth}%`,
                  position: 'fixed',
                  bottom: '0px',
                  left: `${30 + index * (repeatWidth - overlap)}%`,
                }}
              />
            
            </React.Fragment>
          ))}
        </>
      )}
    </main>
  );
}

export default MainPage;