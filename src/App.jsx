// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Screen from "./game/Screen";
import Pad from "./game/buttons/Pad";
import Actions from "./game/buttons/Actions";
import StartSelect from "./game/buttons/StartSelect";

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [hoverPokemon, setHoverPokemon] = useState(0);
  const [selectedPokemones, setSelectedPokemones] = useState([]);
  const [health, setHealth] = useState([100, 100]);
  const [moves, setMoves] = useState([[], []]);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const BASE_URL = "https://pokeapi.co/api/v2/";
  const [playerAttackEffect, setPlayerAttackEffect] = useState(false);
  const [enemyAttackEffect, setEnemyAttackEffect] = useState(false);
  const [projectile, setProjectile] = useState(null); //para la animación del ataque
  const [winner, setWinner] = useState(null); //indica el ganador 



  useEffect(() => {
    const getPokemones = async () => {
      const res = await fetch(`${BASE_URL}/pokemon`);
      const data = await res.json();
      const pokemonsDetails = await getDetails(data.results);
      setPokemones(pokemonsDetails);
    };
    getPokemones();
  }, []);

  const getDetails = async (results) => {
    const res = await Promise.all(results.map((result) => fetch(result.url)));
    const data = await Promise.all(res.map((gato) => gato.json()));
    return data;
  };

  const handleSelectPokemon = () => {
    const pokemonSelected = pokemones.filter(
      (pokemon) => pokemon.id === hoverPokemon
    );
    const selections = [pokemonSelected, computerSelection()];
    setSelectedPokemones(selections);
    setHealth([100, 100]);
  };

  const computerSelection = () => {
    const randomid = Math.floor(Math.random() * pokemones.length);
    const selectElement = pokemones.filter(
      (pokemon) => pokemon.id === randomid
    );
    return selectElement;
  };

  const handlePress = (dir) => {
    if (dir === "right" && hoverPokemon < pokemones.length - 1) {
      setHoverPokemon(hoverPokemon + 1);
    }
    if (dir === "left" && hoverPokemon > 0) {
      setHoverPokemon(hoverPokemon - 1);
    }
  };


  useEffect(() => {
    const fetchMoves = async () => {
      if (selectedPokemones.length === 2) {
        const moves1 = selectedPokemones[0][0].moves.slice(0, 4);
        const moves2 = selectedPokemones[1][0].moves.slice(0, 4);
        setMoves([moves1, moves2]);
      }
    };
    fetchMoves();
  }, [selectedPokemones]);

  const handlePlayerAttack = () => {
    if (selectedPokemones.length === 2 && !winner) {
      const damage = Math.floor(Math.random() * 20) + 10;
      const newHealth = [...health];
      newHealth[1] -= damage;
      if (newHealth[1] < 0) newHealth[1] = 0;
      setHealth(newHealth);

      setProjectile({ from: "player", to: "enemy" });
      setPlayerAttackEffect(true);
      setTimeout(() => setPlayerAttackEffect(false), 500);
    }
  };

  useEffect(() => {
    let interval;
    if (enemyAttacking && !winner) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * 20) + 10;
        setEnemyAttackEffect(true);
        setProjectile({ from: "enemy", to: "player" });
        setTimeout(() => setEnemyAttackEffect(false), 500);

        setHealth((prevHealth) => {
          const newHealth = [...prevHealth];
          newHealth[0] -= damage;
          if (newHealth[0] < 0) newHealth[0] = 0;
          return newHealth;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [enemyAttacking, winner]);


  useEffect(() => {
    if (health[0] === 0 && !winner) {
      setWinner("enemy");
      setEnemyAttacking(false);
    } else if (health[1] === 0 && !winner) {
      setWinner("player");
      setEnemyAttacking(false);
    }
  }, [health]);


  useEffect(() => {
    let interval;
    if (enemyAttacking) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * 20) + 10;
        setEnemyAttackEffect(true);
        setTimeout(() => setEnemyAttackEffect(false), 500);


        setHealth((prevHealth) => {
          const newHealth = [...prevHealth];
          newHealth[0] -= damage;
          if (newHealth[0] < 0) newHealth[0] = 0;
          return newHealth;
        });
      }, 1000); // Ataque cada cierto tiempo
    }
    return () => clearInterval(interval);
  }, [enemyAttacking]);

  const handleStart = () => {
    setEnemyAttacking(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "350px",
          height: "500px",
          border: "2px black solid",
          borderRadius: "5px 5px 35px 5px",
          backgroundColor: "rgb(221, 221, 225)",
        }}
      >
        <Screen
          pokemones={pokemones}
          hoverPokemon={hoverPokemon}
          selectedPokemones={selectedPokemones}
          health={health}
          projectile={projectile}
          winner={winner}
          setProjectile={setProjectile}
        />

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Pad handlePress={handlePress} />
          <StartSelect handleSelectPokemon={handleSelectPokemon} handleStart={handleStart} />
          <Actions handlePlayerAttack={handlePlayerAttack} />
        </div>
      </div>
    </div>
  );
}

export default App;
