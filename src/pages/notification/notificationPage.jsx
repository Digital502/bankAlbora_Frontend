import React from 'react';
import { NavbarDashboardUser } from '../../components/navs/NavbarDashboardUser';
import { NotificationList } from '../../components/notification/notification';

export const NotificationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <NavbarDashboardUser />
      <NotificationList />
    </div>
  );
};