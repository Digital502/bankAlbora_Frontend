import React from 'react';
import { NavbarDashboarOrganization } from "../../components/navs/NavbarDashboardOrganization";
import {PerfilOrganizacion} from "../../components/organization/organizationProfile"

export const ProfilePageOrganization = () => {
  return (
    <div>
      <NavbarDashboarOrganization />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">
        <PerfilOrganizacion/>
      </div>
    </div>
  );
};