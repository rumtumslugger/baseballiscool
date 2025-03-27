import React from "react";
import FantasyBaseball from "./components/FantasyBaseball";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 className="text-3xl font-bold text-center my-4">
        <img src="/public/baseball.png" alt="Baseball" className="spin-img" />
        Baseball is Cool
        <img src="/public/baseball.png" alt="Baseball" className="spin-img" />
      </h1>
      <FantasyBaseball />
    </div>
  );
}

export default App;