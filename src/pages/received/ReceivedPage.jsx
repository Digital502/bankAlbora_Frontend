import React from 'react';
import { NavbarDashboardUser } from "../../components/navs/NavbarDashboardUser";
import {AccountListWithIngresos} from "../../components/account/AccountListWithIngresos.jsx"

export const ReceivedPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <NavbarDashboardUser />

      <main className="flex-grow px-6 py-10">
        <AccountListWithIngresos />
      </main>
    </div>
  );
};