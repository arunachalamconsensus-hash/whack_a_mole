
// eslint-disable-next-line no-unused-vars
import React from "react";
import Game from "./Game";
import "./App.css";

function App() {
  return (
    <div className="app">

      <header className="header">
        <div className="header-icon">🔨</div>
        <h1>Whack-a-Mole</h1>
        <p>Test your speed and beat the computer!</p>
      </header>

      <main className="main-content">
        <Game />
      </main>

      <footer className="footer">
        <p>React Game Project | Built with React Hooks</p>
      </footer>

    </div>
  );
}

export default App;
