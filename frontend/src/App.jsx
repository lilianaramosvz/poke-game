// App.jsx
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Screen from "./game/Screen";
import Pad from "./game/buttons/Pad";
import Actions from "./game/buttons/Actions";
import StartSelect from "./game/buttons/StartSelect";

const BACKEND_URL = "http://localhost:3000";

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [hoverPokemon, setHoverPokemon] = useState(0);
  const [selectedPokemones, setSelectedPokemones] = useState([]);
  const [health, setHealth] = useState([100, 100]);
  const healthRef = useRef([100, 100]);
  const [moves, setMoves] = useState([[], []]);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const BASE_URL = "https://pokeapi.co/api/v2/";
  const [playerAttackEffect, setPlayerAttackEffect] = useState(false);
  const [enemyAttackEffect, setEnemyAttackEffect] = useState(false);
  const [projectile, setProjectile] = useState(null); 
  const [winner, setWinner] = useState(null); 

  // Keep ref in sync so intervals can read the latest health without stale closures
  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  // SSE — connect once on mount; recover state from DB on error/reconnect
  useEffect(() => {
    const eventSource = new EventSource(`${BACKEND_URL}/api/pokemon/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHealth([data.player ?? 100, data.enemy ?? 100]);
    };

    eventSource.onerror = () => {
      // Recover initial state from DB when connection drops
      fetch(`${BACKEND_URL}/api/pokemon/vida`)
        .then((res) => res.json())
        .then((data) => setHealth([data.player ?? 100, data.enemy ?? 100]))
        .catch(console.error);
    };

    return () => eventSource.close();
  }, []);

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
    const data = await Promise.all(res.map((pokemon) => pokemon.json()));
    return data;
  };

  // Envía los datos al backend
  const guardarResultadoBatalla = async (resultadoGanador) => {
    if (selectedPokemones.length < 2) return;
    const datosBatalla = {
      jugador: selectedPokemones[0][0].name,
      enemigo: selectedPokemones[1][0].name,
      ganador: resultadoGanador, // "player" o "enemy"
      fecha: new Date().toISOString()
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/batallas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosBatalla),
      });
      if (response.ok) {
        console.log("Resultado guardado en Firebase correctamente");
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  const handleSelectPokemon = () => {
    const pokemonSelected = pokemones.filter(
      (pokemon) => pokemon.id === hoverPokemon,
    );
    const selections = [pokemonSelected, computerSelection()];
    setSelectedPokemones(selections);
    setHealth([100, 100]);
    setWinner(null);

    // Initialise health in DB for the new battle
    fetch(`${BACKEND_URL}/api/pokemon/iniciar`, { method: "POST" }).catch(console.error);
  };

  const computerSelection = () => {
    const randomid = Math.floor(Math.random() * pokemones.length);
    const selectElement = pokemones.filter(
      (pokemon) => pokemon.id === randomid,
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

      // Persist updated enemy health to DB
      fetch(`${BACKEND_URL}/api/pokemon/vida`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enemy: newHealth[1] }),
      }).catch(console.error);
    }
  };

  // Efecto del ataque enemigo
  useEffect(() => {
    let interval;
    if (enemyAttacking && !winner) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * 20) + 10;
        setEnemyAttackEffect(true);
        setProjectile({ from: "enemy", to: "player" });
        setTimeout(() => setEnemyAttackEffect(false), 500);

        const newPlayerHealth = Math.max(0, healthRef.current[0] - damage);

        setHealth((prevHealth) => [newPlayerHealth, prevHealth[1]]);

        // Persist updated player health to DB
        fetch(`${BACKEND_URL}/api/pokemon/vida`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player: newPlayerHealth }),
        }).catch(console.error);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [enemyAttacking, winner]);

  // Lógica de victoria y guardado
  useEffect(() => {
    if (health[0] === 0 && !winner) {
      setWinner("enemy");
      setEnemyAttacking(false);
      guardarResultadoBatalla("enemy");
    } else if (health[1] === 0 && !winner) {
      setWinner("player");
      setEnemyAttacking(false);
      guardarResultadoBatalla("player");
    }
  }, [health]);

  const handleStart = () => {
    if (selectedPokemones.length === 2 && !winner) {
      setEnemyAttacking(true);
    }
  };

  return (
    <div className="app-root">
      <div className="gameboy-shell">
        <Screen
          pokemones={pokemones}
          hoverPokemon={hoverPokemon}
          selectedPokemones={selectedPokemones}
          health={health}
          projectile={projectile}
          winner={winner}
          setProjectile={setProjectile}
        />

        <div className="controls-row">
          <Pad handlePress={handlePress} />
          <StartSelect
            handleSelectPokemon={handleSelectPokemon}
            handleStart={handleStart}
          />
          <Actions handlePlayerAttack={handlePlayerAttack} />
        </div>
      </div>
    </div>
  );
}

export default App;
