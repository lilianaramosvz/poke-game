import { useEffect, useState, useRef } from "react";
import "./App.css";
import Screen from "./game/Screen";
import Pad from "./game/buttons/Pad";
import Actions from "./game/buttons/Actions";
import StartSelect from "./game/buttons/StartSelect";

const API = "http://localhost:3000/api";

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
  const [projectile, setProjectile] = useState(null);
  const [winner, setWinner] = useState(null);

  const sseRef = useRef(null); 

  // --- FETCH POKEMONS ---
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

  // --- GUARDAR BATALLA ---
  const guardarResultadoBatalla = async (resultadoGanador) => {
    if (selectedPokemones.length < 2) return;

    const datosBatalla = {
      jugador: selectedPokemones[0][0].name,
      enemigo: selectedPokemones[1][0].name,
      ganador: resultadoGanador,
      fecha: new Date().toISOString(),
    };

    try {
      await fetch(`${API}/batallas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosBatalla),
      });
      console.log("Resultado guardado en Firebase");
    } catch (error) {
      console.error("Error al guardar batalla:", error);
    }
  };

  // --- ACTUALIZAR VIDA EN BACKEND ---
  const actualizarVidaEnBD = async (vidaJugador, vidaEnemigo) => {
    try {
      await fetch(`${API}/vida`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vidaJugador, vidaEnemigo }),
      });
    } catch (error) {
      console.error("Error al actualizar vida:", error);
    }
  };

  // --- SINCRONIZAR VIDA AUTOMÁTICAMENTE ---
  useEffect(() => {
    if (selectedPokemones.length === 2) {
      actualizarVidaEnBD(health[0], health[1]);
    }
  }, [health, selectedPokemones.length]);

  // --- SSE (tiempo real) ---
  const conectarSSE = () => {
    if (sseRef.current) sseRef.current.close();

    const sse = new EventSource(`${API}/vida/stream`);
    sseRef.current = sse;

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Actualización desde Firebase:", data);

      if (data?.vidaJugador != null && data?.vidaEnemigo != null) {
        setHealth([data.vidaJugador, data.vidaEnemigo]);
      }
    };

    sse.onerror = () => {
      console.error("Error en SSE");
      sse.close();
    };
  };

  // --- LIMPIAR SSE ---
  useEffect(() => {
    return () => {
      if (sseRef.current) sseRef.current.close();
    };
  }, []);

  // --- SELECCIONAR POKEMON ---
  const handleSelectPokemon = () => {
    const pokemonSelected = pokemones.filter(
      (pokemon) => pokemon.id === hoverPokemon
    );

    const selections = [pokemonSelected, computerSelection()];

    setSelectedPokemones(selections);
    setHealth([100, 100]);
    setWinner(null);

    conectarSSE(); 
  };

  const computerSelection = () => {
    const randomid = Math.floor(Math.random() * pokemones.length);
    return pokemones.filter((pokemon) => pokemon.id === randomid);
  };

  const handlePress = (dir) => {
    if (dir === "right" && hoverPokemon < pokemones.length - 1)
      setHoverPokemon(hoverPokemon + 1);
    if (dir === "left" && hoverPokemon > 0)
      setHoverPokemon(hoverPokemon - 1);
  };

  // --- MOVES ---
  useEffect(() => {
    if (selectedPokemones.length === 2) {
      const moves1 = selectedPokemones[0][0].moves.slice(0, 4);
      const moves2 = selectedPokemones[1][0].moves.slice(0, 4);
      setMoves([moves1, moves2]);
    }
  }, [selectedPokemones]);

  // --- ATAQUE JUGADOR ---
  const handlePlayerAttack = () => {
    if (selectedPokemones.length === 2 && !winner) {
      const damage = Math.floor(Math.random() * 20) + 10;

      setHealth((prev) => {
        const newHealth = [...prev];
        newHealth[1] = Math.max(0, newHealth[1] - damage);
        return newHealth;
      });

      setProjectile({ from: "player", to: "enemy" });
      setPlayerAttackEffect(true);
      setTimeout(() => setPlayerAttackEffect(false), 500);
    }
  };

  // --- ATAQUE ENEMIGO ---
  useEffect(() => {
    let interval;

    if (enemyAttacking && !winner) {
      interval = setInterval(() => {
        const damage = Math.floor(Math.random() * 20) + 10;

        setEnemyAttackEffect(true);
        setProjectile({ from: "enemy", to: "player" });
        setTimeout(() => setEnemyAttackEffect(false), 500);

        setHealth((prev) => {
          const newHealth = [...prev];
          newHealth[0] = Math.max(0, newHealth[0] - damage);
          return newHealth;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [enemyAttacking, winner]);

  // --- GANADOR ---
  useEffect(() => {
    if (health[0] === 0 && !winner) {
      setWinner("enemy");
      setEnemyAttacking(false);
      guardarResultadoBatalla("enemy");
      if (sseRef.current) sseRef.current.close();
    } else if (health[1] === 0 && !winner) {
      setWinner("player");
      setEnemyAttacking(false);
      guardarResultadoBatalla("player");
      if (sseRef.current) sseRef.current.close();
    }
  }, [health, winner]);

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