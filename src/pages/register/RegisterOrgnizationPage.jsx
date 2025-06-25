import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { RegisterOrganization } from "../../components/RegisterOrganization";
import { RegisterBancario } from "../../components/RegisterBancario";
import { RegisterBancarioOrganization } from "../../components/RegisterBancarioOrganization";
import { NavbarDashboardAdmin } from "../../components/navs/NavbarDashboardAdmin";

export const RegisterOrganizationPage = () => {
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
        <RegisterOrganization switchAuthHandler={handleAuthPageToggle} />
      ) : (
        <RegisterBancarioOrganization switchAuthHandler={handleAuthPageToggle} />

      )}

    </div>
  );
};
