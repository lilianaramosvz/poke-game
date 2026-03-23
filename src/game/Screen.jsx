// Screen.jsx
const Screen = ({ pokemones, hoverPokemon, selectedPokemones, health, playerAttackEffect, enemyAttackEffect, projectile, winner, setProjectile }) => {

  return (
    <div className="container-screen">
      <div className="screen-text">
        <div className="screen">
          {selectedPokemones.length === 2 ? (
            <div>

              {/* barra de vida */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "45%" }}>
                  <p style={{ fontSize: "10px", margin: 0 }}>{selectedPokemones[0][0].name}</p>
                  <div style={{ width: "100%", backgroundColor: "#ccc", height: "10px", borderRadius: "5px" }}>
                    <div
                      style={{
                        width: `${health[0]}%`,
                        backgroundColor: "green",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "45%" }}>
                  <p style={{ fontSize: "10px", margin: 0 }}>{selectedPokemones[1][0].name}</p>
                  <div style={{ width: "100%", backgroundColor: "#ccc", height: "10px", borderRadius: "5px" }}>
                    <div
                      style={{
                        width: `${health[1]}%`,
                        backgroundColor: "red",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              </div>




              {/* dispaross */}
              {projectile && (
                <div
                  style={{
                    position: "absolute",
                    top: projectile.from === "player" ? "60%" : "30%", // Posición inicial
                    left: projectile.from === "player" ? "30%" : "60%", // Posición inicial
                    width: "10px",
                    height: "10px",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    animation: "projectileMove 0.5s linear",
                    animationName: projectile.from === "player" ? "moveDiagonalRight" : "moveDiagonalLeft", // Direcciones de animación
                  }}
                  onAnimationEnd={() => setProjectile(null)}
                />
              )}


              {/* display imagenes pokes*/}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <img
                  src={selectedPokemones[0][0].sprites?.front_default}
                  alt="pokemon seleccionado"
                />
              </div>
              <div style={{ width: "315px", height: "50%" }}>
                <img
                  src={selectedPokemones[1][0].sprites?.back_default}
                  alt="pokemon enemigo"
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {pokemones?.map((pokemon) => (
                <div
                  key={pokemon.id}
                  style={{
                    backgroundColor: `${hoverPokemon === pokemon.id ? "yellow" : ""}`,
                  }}
                >
                  <img src={pokemon.sprites.front_default} alt="pokemones" />
                  <p style={{ fontFamily: "Pokemon Classic", fontSize: "8px" }}>
                    {pokemon.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {winner && (
          <div style={{
            position: "absolute",
            top: "16%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "10px",
            border: "2px solid black",
            borderRadius: "10px",
          }}>
            <h3 style={{ fontFamily: "Pokemon Classic" }}>
              {winner === "player" ? "¡Ganaste!" : "¡Perdiste!"}
            </h3>
          </div>
        )}


        <div className="container-text">
          <p className="text">
            Nintendo <span>GAME BOY</span>
            <span style={{ fontSize: "8px" }}> TM</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Screen;
