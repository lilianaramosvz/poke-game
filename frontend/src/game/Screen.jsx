// Screen.jsx
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
  return (
    <div className="container-screen">
      <div className="screen-text">
        <div className={`screen ${selectedPokemones.length === 2 ? "screen-battle" : ""}`}>
          {selectedPokemones.length === 2 ? (
            <div className="battle-stage">
              <div className="battle-column battle-column-player">
                <div className="health-card">
                  <p className="health-name">{selectedPokemones[0][0].name}</p>
                  <div className="health-track">
                    <div
                      className="health-fill health-fill-player"
                      style={{ width: `${health[0]}%` }}
                    />
                  </div>
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
                    src={selectedPokemones[0][0].sprites?.front_default}
                    alt="pokemon seleccionado"
                  />
                </div>
              </div>
              <div className="battle-divider" aria-hidden="true" />
              <div className="battle-column battle-column-enemy">
                <div className="health-card">
                  <p className="health-name">{selectedPokemones[1][0].name}</p>
                  <div className="health-track">
                    <div
                      className="health-fill health-fill-enemy"
                      style={{ width: `${health[1]}%` }}
                    />
                  </div>
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
                    src={selectedPokemones[1][0].sprites?.back_default}
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
                  className={`pokemon-card ${hoverPokemon === pokemon.id ? "pokemon-card-hover" : ""}`}
                >
                  <img src={pokemon.sprites.front_default} alt="pokemones" />
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
