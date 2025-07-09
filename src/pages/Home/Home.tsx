import type React from "react";
import { useState } from "react";
import NavBar from '../../components/NavBar/NavBar';
import Layout from '../../components/Layout/Layout';
import './Home.css'; 

const Home: React.FC = () => {

  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>("Inicio");

  const handleSelectOption = (option: string) => {
    setSelectedSidebarOption(option);
  };

  return (
    <div className="home-container">
      <NavBar />
      <Layout selectedOption={selectedSidebarOption} onSelectOption={handleSelectOption} />

    </div>

  );
};

export default Home;