import React from 'react';
import image from '../assets/images/dancer.png';
import repeatA from '../assets/images/repeatA.png';
import repeatB from '../assets/images/repeatB.png';
import '../assets/css/landing.css';

function MainPage() {
  const screenWidth = window.innerWidth;
  const repeatWidth = 9.8;
  const overlap = 0.08;
  const numRepeats = Math.ceil(screenWidth / (repeatWidth * 2 - overlap));

  return (
    <main className="main-page">
      <div className="header">
        <header> Dance </header>
        <header> Teacher  </header>
      </div>
     
      <img src={image} alt="Dancer" style={{ width: '30%', position: 'fixed', bottom: '0px', left: '0px', borderRadius: '40% 40% 0 0' }}/>
      {[...Array(numRepeats).keys()].map((index) => (
        <React.Fragment key={index}>
          <img
            src={index % 2 === 0 ? repeatB : repeatA}
            alt="Repeat"
            style={{
              width: `${repeatWidth}%`,
              position: 'fixed',
              bottom: '0px',
              left: `${30 + (index * (repeatWidth - overlap))}%`
            }}
          />
        </React.Fragment>
      ))}
    </main>
  );
}

export default MainPage;