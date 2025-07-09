import './SideBar.css'
import type React from "react";

interface SidebarProps {
  onSelectOption: (option: string) => void;
  selectedOption: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption, selectedOption }) => {
  
  const menuItems = [
    { name: "Inicio", icon: <i className="fa-solid fa-house-chimney"></i> },
    { name: "Productos", icon: <i className="fa-solid fa-box-open"></i> },
    { name: "Balanza", icon: <i className="fa-solid fa-scale-balanced"></i>},
    { name: "Servicios", icon: <i className="fa-solid fa-bell-concierge"></i>},
    { name: "Contacto", icon: <i className="fa-solid fa-envelope"></i> },
  ];

  return (
    <aside className="sidebar-aside">
      <h3>Menú</h3>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => onSelectOption(item.name)}
            className={`sidebar-menu-item ${selectedOption === item.name ? 'sidebar-menu-item-active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;