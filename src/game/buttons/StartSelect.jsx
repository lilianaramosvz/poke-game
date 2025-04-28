//StartSelect.jsx

import React from "react";

const StartSelect = ({ handleSelectPokemon, handleStart }) => {
  return (
    <div className="select-start-container">
      <div className="select-start-btn-wrapper">
        <button
          className="select-start-btn"
          onClick={handleSelectPokemon}
        ></button>
        <span className="select-start-label">SELECT</span>
      </div>
      <div className="select-start-btn-wrapper">
        <button className="select-start-btn" onClick={handleStart}></button>
        <span className="select-start-label">START</span>
      </div>
    </div>
  );
};

export default StartSelect;
