import React from 'react';
// import './App.css';

const Counter = ({ position }) => {
    console.log(position);
    let y = 373 + position * -34.3;
    if (position > 0) (y += position * .7);
    console.log(`${y}px`);

    return (
        <div className="counter" style={{ left: `${y}px`, top:"497px", zIndex:"8888" }}></div>
    );
};

export default Counter;
