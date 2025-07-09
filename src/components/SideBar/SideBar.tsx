import './SideBar.css'
import type React from "react";

interface SidebarProps {
  onSelectOption: (option: string) => void;
  selectedOption: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption, selectedOption }) => {
  const options = ["Inicio", "Productos", "Servicios", "Contacto"];

  return (
    <aside style={{ width: "200px", background: "#f4f4f4", padding: "1rem", borderRight: "1px solid #ddd" }}>
      <h3>Menú</h3>
      <ul>
        {options.map((option) => (
          <li
            key={option}
            onClick={() => onSelectOption(option)}
            style={{
              marginBottom: "0.5rem",
              cursor: "pointer",
              fontWeight: selectedOption === option ? "bold" : "normal",
              color: selectedOption === option ? "#007bff" : "inherit",
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;