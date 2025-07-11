import './NavBar.css'
import { useNavigate } from 'react-router-dom'
import logoNav from '../../assets/img/logo_carnes_puro_bueno.png'

import type React from "react";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-title">
        <img src={logoNav} alt="logo-nav" className='logo-nav' />
        <h1>Balanza Digital</h1>
      </div>

      <i className="fa-solid fa-door-open" onClick={handleLoginClick}></i>
    </nav>
  );
};

export default NavBar;
