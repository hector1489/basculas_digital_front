import type React from "react";
import Sidebar from "../SideBar/SideBar";
import Products from '../Products/Products'; 
import Scales from "../Scales/Scales";
import SyncDevices from "../SyncDevices/SyncDevices"; 
import ManageUsers from "../ManageUsers/ManageUsers";
import ContactForm from "../ContactForm/ContactForm";

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
        case "Sincronizar":
         return <SyncDevices />;
      case "Usuarios":
        return <ManageUsers />
      case "Contacto":
        return <ContactForm />
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