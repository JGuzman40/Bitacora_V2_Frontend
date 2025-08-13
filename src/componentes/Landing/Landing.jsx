import { Link } from "react-router-dom";
import "./Landing.css";
import AryaLogo from "/arya.svg";

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>Bitácora</h1>
        {/* Puedes activar el logo si gustas */}
        {/* <img src={MicrohuascaLogo} alt="Logo Microhuasca" className="logo-img" /> */}
      </header>

      <main className="landing-main">
        <Link to="/login">
          <button>Entrar</button>
        </Link>
      </main>

      <footer className="landing-footer">
        <img src={AryaLogo} alt="Logo Arya" className="footer-logo" />
        <h5>Desarrollado por Jesu Guzman</h5>
      </footer>
    </div>
  );
}

export default Landing;
