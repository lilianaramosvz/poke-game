//Actions.jsx

import React from "react";

const Actions = ({ computerSelection, handlePlayerAttack }) => {
  return (
    <div
      style={{
        width: "90px",
        height: "60px",
        display: "flex",
        gap: "10px",
        transform: "rotate(-20deg)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          style={{
            backgroundColor: "rgb(113, 0, 26)",
            width: "40px",
            height: "60px",
            borderRadius: "100%",
          }}
          onClick={handlePlayerAttack}
        ></button>
        <span
          style={{
            transform: "rotate(20deg)",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          B
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          style={{
            backgroundColor: "rgb(113, 0, 26)",
            width: "40px",
            height: "60px",
            borderRadius: "100%",
          }}
        ></button>
        <span
          style={{
            transform: "rotate(20deg)",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          A
        </span>
      </div>
    </div>
  );
};

export default Actions;
