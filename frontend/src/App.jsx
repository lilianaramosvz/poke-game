//frontend\src\App.jsx
import { useEffect, useState, useRef } from "react";
import "./App.css";
import Screen from "./game/Screen";
import Pad from "./game/buttons/Pad";
import Actions from "./game/buttons/Actions";
import StartSelect from "./game/buttons/StartSelect";

const API = import.meta.env.VITE_API_URL ?? "/api";

const normalizeHealthValue = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(100, parsed));
};

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [hoverPokemon, setHoverPokemon] = useState(1);
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

  useEffect(() => {
    const getPokemones = async () => {
      const res = await fetch(`${BASE_URL}/pokemon`);
      const data = await res.json();
      const pokemonsDetails = await getDetails(data.results);
      setPokemones(pokemonsDetails);
    };
    getPokemones();
  }, []);

  useEffect(() => {
    if (pokemones.length > 0 && hoverPokemon === 0) {
      setHoverPokemon(pokemones[0].id);
    }
  }, [pokemones, hoverPokemon]);

  const getDetails = async (results) => {
    const res = await Promise.all(results.map((result) => fetch(result.url)));
    const data = await Promise.all(res.map((pokemon) => pokemon.json()));
    return data;
  };

  // GUARDAR BATALLA
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
    } catch (error) {
      console.error("Error al guardar batalla:", error);
    }
  };

  const conectarSSE = () => {
    if (sseRef.current) sseRef.current.close();

    const sse = new EventSource(`${API}/vida/stream`);
    sseRef.current = sse;

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const vidaJugador = normalizeHealthValue(
        data?.vidaJugador ?? data?.player,
      );
      const vidaEnemigo = normalizeHealthValue(
        data?.vidaEnemigo ?? data?.enemy,
      );

      if (vidaJugador != null && vidaEnemigo != null) {
        setHealth([vidaJugador, vidaEnemigo]);
      }
    };

    sse.onerror = () => {
      console.error("Error en SSE");
      sse.close();
    };
  };

  useEffect(() => {
    return () => {
      if (sseRef.current) sseRef.current.close();
    };
  }, []);

  const handleSelectPokemon = async () => {
    const pokemonSelected = pokemones.filter(
      (pokemon) => pokemon.id === hoverPokemon,
    );

    const enemy = computerSelection();

    if (!pokemonSelected.length || !enemy.length) return;

    setSelectedPokemones([pokemonSelected, enemy]);
    setWinner(null);

    await fetch(`${API}/vida/iniciar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jugador: pokemonSelected[0].name,
        enemigo: enemy[0].name,
      }),
    });

    conectarSSE();
  };

  const computerSelection = () => {
    if (pokemones.length === 0) return [];

    const randomIndex = Math.floor(Math.random() * pokemones.length);
    const randomPokemon = pokemones[randomIndex];

    return randomPokemon ? [randomPokemon] : [];
  };

  const handlePress = (dir) => {
    if (dir === "right" && hoverPokemon < pokemones[pokemones.length - 1]?.id)
      setHoverPokemon(hoverPokemon + 1);
    if (dir === "left" && hoverPokemon > 1) setHoverPokemon(hoverPokemon - 1);
  };

  // MOVIMIENTOS
  useEffect(() => {
    if (selectedPokemones.length === 2) {
      const moves1 = selectedPokemones[0][0].moves.slice(0, 4);
      const moves2 = selectedPokemones[1][0].moves.slice(0, 4);
      setMoves([moves1, moves2]);
    }
  }, [selectedPokemones]);

  const handlePlayerAttack = async () => {
    if (selectedPokemones.length === 2 && !winner) {
      const damage = Math.floor(Math.random() * 20) + 10;

      await fetch(`${API}/vida/atacar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atacante: "jugador",
          dano: damage,
        }),
      });

      setProjectile({ from: "player", to: "enemy" });
      setPlayerAttackEffect(true);
      setTimeout(() => setPlayerAttackEffect(false), 500);
    }
  };

  // ATAQUE ENEMIGO
  useEffect(() => {
    let interval;

    if (enemyAttacking && !winner) {
      interval = setInterval(async () => {
        const damage = Math.floor(Math.random() * 20) + 10;

        await fetch(`${API}/vida/atacar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            atacante: "enemigo",
            dano: damage,
          }),
        });

        setEnemyAttackEffect(true);
        setProjectile({ from: "enemy", to: "player" });
        setTimeout(() => setEnemyAttackEffect(false), 500);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [enemyAttacking, winner]);

  // GANADOR
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
