import './SideBar.css'
import type React from "react";

interface SidebarProps {
  onSelectOption: (option: string) => void;
  selectedOption: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption, selectedOption }) => {
  const options = ["Inicio", "Productos", "Servicios", "Contacto"];

  return (
    <aside className="sidebar-aside">
      <h3>Menú</h3>
      <ul>
        {options.map((option) => (
          <li
            key={option}
            onClick={() => onSelectOption(option)}
            className={`sidebar-menu-item ${selectedOption === option ? 'sidebar-menu-item-active' : ''}`}
          >
            {option}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;