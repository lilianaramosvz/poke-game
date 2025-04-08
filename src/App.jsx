//App.jsx

import { useEffect, useState } from "react";
import "./App.css";
import Screen from "./game/Screen";
import Pad from "./game/buttons/Pad";
import Actions from "./game/buttons/Actions";

function App() {
  const [pokemones, setPokemones] = useState([]);
  const BASE_URL = "https://pokeapi.co/api/v2/";

  const getPokemones = async () => {
    const res = await fetch(`${BASE_URL}/pokemon`);
    const data = await res.json();
    console.log(data);

    const pokemonsDetails = await getDetails(data.results);

    setPokemones(pokemonsDetails);
  };

  const getDetails = async (results) => {
    const res = await Promise.all(results.map((result) => fetch(result.url)));
    const data = await Promise.all(res.map((gato) => gato.json()));
    return data;
  };

  const handlePress = (dir) => {
    console.log(dir);
  };

  useEffect(() => {
    getPokemones();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* container game */}
        <div
          style={{
            width: "350px",
            height: "500px",
            border: "2px black solid",
            borderRadius: "5px 5px 35px 5px",
            backgroundColor: "rgb(221, 221, 225)",
          }}
        >
          {/* container screen */}

          <Screen pokemones={pokemones} />

          {/* container buttons */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Pad handlePress={handlePress()} />

            {/* botones A y B */}

            {/* Botones morados */}
            <div
              style={{
                width: "90px",
                height: "40px",
                display: "flex",
                gap: "10px",
                transform: "rotate(-20deg)",
              }}
            >
              <div>
                {" "}
                <button
                  style={{
                    backgroundColor: "rgb(128, 21, 95)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "100%",
                  }}
                ></button>
              </div>
              <div>
                <button
                  style={{
                    backgroundColor: "rgb(128, 21, 95)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
