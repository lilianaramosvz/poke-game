// frontend\src\game\Screen.jsx
import "./Screen.css";

const Screen = ({
  pokemones,
  hoverPokemon,
  selectedPokemones,
  health,
  projectile,
  winner,
  setProjectile,
}) => {
  const player = selectedPokemones?.[0]?.[0];
  const enemy = selectedPokemones?.[1]?.[0];

  return (
    <div className="container-screen">
      <div className="screen-text">
        <div className={`screen ${player && enemy ? "screen-battle" : ""}`}>
          {player && enemy ? (
            <div className="battle-stage">
              <div className="battle-column battle-column-player">
                <div className="health-card">
                  <p className="health-name">{player?.name || "..."}</p>
                  <div className="health-track">
                    <div
                      className="health-fill health-fill-player"
                      style={{ width: `${playerHealth}%` }}
                    />
                  </div>
                  <p className="health-value">{playerHealth}/100</p>
                </div>

                <div className="player-pokemon-wrapper">
                  {projectile?.from === "player" && (
                    <div
                      className="projectile projectile-player"
                      onAnimationEnd={() => setProjectile(null)}
                    />
                  )}

                  <img
                    className="battle-sprite"
                    src={player?.sprites?.front_default}
                    alt="pokemon jugador"
                  />
                </div>
              </div>

              <div className="battle-divider" aria-hidden="true" />

              <div className="battle-column battle-column-enemy">
                <div className="health-card">
                  <p className="health-name">{enemy?.name || "..."}</p>
                  <div className="health-track">
                    <div
                      className="health-fill health-fill-enemy"
                      style={{ width: `${enemyHealth}%` }}
                    />
                  </div>
                  <p className="health-value">{enemyHealth}/100</p>
                </div>

                <div className="enemy-pokemon-wrapper">
                  {projectile?.from === "enemy" && (
                    <div
                      className="projectile projectile-enemy"
                      onAnimationEnd={() => setProjectile(null)}
                    />
                  )}

                  <img
                    className="battle-sprite"
                    src={enemy?.sprites?.back_default}
                    alt="pokemon enemigo"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pokemon-grid">
              {pokemones?.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className={`pokemon-card ${
                    hoverPokemon === pokemon.id ? "pokemon-card-hover" : ""
                  }`}
                >
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                  <p className="pokemon-name">{pokemon.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {winner && (
          <div className="winner-modal">
            <h3 className="winner-title">
              {winner === "player" ? "¡Ganaste!" : "¡Perdiste!"}
            </h3>
          </div>
        )}

        <div className="container-text">
          <p className="text">
            Nintendo <span>GAME BOY</span>
            <span className="tm-text"> TM</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Screen;
