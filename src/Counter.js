import React from 'react';
// import './App.css';


const green = 34.3;
const greencenter = 373;
const trans = 47
const transcenter = 500

const center = 488 - 2;
let delta = 46.2; // + 10
delta = 46.5;

const topOld = 497;
const topNew = 548;

const top = topNew;

const Counter = ({ position }) => {

    console.log(position);
    let y = center + position * -delta;
    if (position > 0) (y += position * .7);
    console.log(`${y}px`);

    return (
        <div className="counter" style={{ left: `${y}px`, top:`${top}px`, zIndex:"900" }}></div>
    );
};

export default Counter;
