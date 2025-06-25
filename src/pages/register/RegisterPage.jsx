import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Register } from "../../components/Register";
import { RegisterBancario } from "../../components/RegisterBancario";
import { NavbarDashboardAdmin } from "../../components/navs/NavbarDashboardAdmin";
import { Footer } from "../../components/footer/Footer";

export const RegisterPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const form = params.get("form");

  const [isRegister, setIsRegister] = useState(() => form !== "bancario");

  const handleAuthPageToggle = () => {
    setIsRegister((prevState) => !prevState);
  };

  return (
    <div >
      <NavbarDashboardAdmin />  
      {isRegister ? (
        <Register switchAuthHandler={handleAuthPageToggle} />
      ) : (
        <RegisterBancario switchAuthHandler={handleAuthPageToggle} />

      )}

    </div>
  );
};
