//Pad.jsx

import React from "react";
import "./styles.css";

const Pad = ({ handlePress }) => {
  return (
    <div className="container-pad">
      <button className="pad-btn" onClick={() => handlePress("up")}></button>
      <div className="container-central">
        <button
          className="pad-btn"
          onClick={() => handlePress("left")}
        ></button>
        <button className="pad-btn"></button>
        <button
          className="pad-btn"
          onClick={() => handlePress("right")}
        ></button>
      </div>
      <button className="pad-btn" onClick={() => handlePress("down")}></button>
    </div>
  );
};

export default Pad;
