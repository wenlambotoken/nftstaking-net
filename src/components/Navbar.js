import React from "react";
import { useNavigate } from "react-router-dom";
import ConnectButton from "../functions/ConnectButton";

export default function Navbar(props) {
  const navigate = useNavigate();

  const navigateToFarm = () => {
    navigate("/farm");
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div>
        <nav className="navbar navbarfont navbarglow navbar-expand-md navbar-dark bg-dark mb-4">
          <div
            className="container-fluid nav-container"
            style={{ fontFamily: "SF Pro Display" }}
          >
            <img
            alt='logo'
              className="nav-logo"
              style={{ width: "100px" }}
              src="lambo-logo.png"
            />
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul
                className="navbar-nav me-auto mb-2 px-3 mb-md-0"
                style={{ fontSize: "25px" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    onClick={navigateHome}
                  >
                    Staking Page
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link active px-4"
                    aria-current="page"
                    onClick={navigateToFarm}
                  >
                    Farming
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <ConnectButton 
          connectwallet={props.connectwallet}
          />
        </nav>
    </div>
  );
}
