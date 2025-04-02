import "./App.css";

function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          <div
            style={{
              paddingTop: "5%",
              paddingBottom: "25%",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "85%",
                height: "200px",
                backgroundColor: "rgb(162, 180, 52)",
              }}
            ></div>
          </div>
          {/* container buttons */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {/*boton izq arriba */}
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "black",
              }}
            >
              <div>
                <button
                  style={{
                    width: "15px",
                    backgroundColor: "rgb(128blue, 21, 95)",
                    height: "30px",
                  }}
                ></button>
              </div>
              <div></div>
            </div>
            <div style={{ paddingTop: "30%" }}>
              {/* botones A y B */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  backgroundColor: "grey",
                }}
              ></div>
            </div>
            <div
              style={{
                width: "90px",
                height: "40px",
                display: "flex",
                backgroundColor: "rgb(146, 142, 163)",
                display: "flex", gap: "10px", transform: "rotate(-20deg)"
              }}
            >
              <div>
                {" "}
                <button
                  style={{
                    backgroundColor: "rgb(128, 21, 95)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
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
