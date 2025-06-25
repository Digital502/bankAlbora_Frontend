import React from 'react';
import { NavbarDashboardAdmin } from "../../components/navs/NavbarDashboardAdmin";
import {PerfilUsuario} from "../../components/user/Profile"

export const ProfilePageAdmin = () => {
  return (
    <div>
      <NavbarDashboardAdmin />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">
        <PerfilUsuario/>
      </div>
    </div>
  );
};