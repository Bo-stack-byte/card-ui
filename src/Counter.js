import React from 'react';
// import './App.css';


const green = 34.3;
const greencenter = 373;
const trans = 47
const transcenter = 500
const Counter = ({ position }) => {

    console.log(position);
    let y = transcenter + position * -trans;
    y = greencenter + position * -green;
    if (position > 0) (y += position * .7);
    console.log(`${y}px`);

    return (
        <div className="counter" style={{ left: `${y}px`, top:"497px", zIndex:"900" }}></div>
    );
};

export default Counter;
