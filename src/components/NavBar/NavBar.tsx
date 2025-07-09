import './NavBar.css'
import { useNavigate } from 'react-router-dom'

import type React from "react";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <h1>Balanza Digital</h1>
      <i className="fa-solid fa-door-open" onClick={handleLoginClick}></i>
    </nav>
  );
};

export default NavBar;
