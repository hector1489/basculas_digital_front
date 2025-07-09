import type React from "react";
import Sidebar from "../SideBar/SideBar";
import Products from '../Products/Products'; 
import Scales from "../Scales/Scales";

interface LayoutProps {
  children?: React.ReactNode;
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ selectedOption, onSelectOption }) => {
 
  const renderContent = () => {
    switch (selectedOption) {
      case "Inicio":
        return (
          <div>
            <h2>Contenido de Inicio</h2>
            <p>Bienvenido a la página de inicio. Aquí encontrarás la información general de la aplicación.</p>
          </div>
        );
      case "Productos":
        return <Products />;
      case "Balanza":
        return <Scales />;
      case "Servicios":
        return (
          <div>
            <h2>Nuestros Servicios</h2>
            <p>Ofrecemos una amplia gama de servicios para satisfacer tus necesidades.</p>
            <ul>
              <li>Servicio X</li>
              <li>Servicio Y</li>
            </ul>
          </div>
        );
      case "Contacto":
        return (
          <div>
            <h2>Contáctanos</h2>
            <p>Puedes contactarnos a través de nuestro formulario o en nuestras redes sociales.</p>
            <p>Email: info@miapp.com</p>
          </div>
        );
      default:
        return (
          <div>
            <h2>Selecciona una opción</h2>
            <p>Haz clic en una de las opciones del menú lateral para ver su contenido.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
      <Sidebar onSelectOption={onSelectOption} selectedOption={selectedOption} />
      <main style={{ flexGrow: 1, padding: "1rem" }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;