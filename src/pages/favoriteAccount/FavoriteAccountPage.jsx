import React from 'react'
import { FavoriteAccount } from '../../components/favoriteAccount/favoriteAccount'
import { NavbarDashboardUser } from '../../components/navs/NavbarDashboardUser'

export const FavoriteAccountPage = () => {
  return (
    <div>
        <NavbarDashboardUser/>
        <FavoriteAccount/>
    </div>
  )
}
