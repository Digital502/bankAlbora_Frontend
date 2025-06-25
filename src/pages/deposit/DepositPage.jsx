import React from 'react'
import { Deposit } from '../../components/deposit/Deposit'
import { NavbarDashboardAdmin } from '../../components/navs/NavbarDashboardAdmin'

export const DepositPage = () => {
  return (
    <div>
      <NavbarDashboardAdmin />
      <Deposit />
    </div>
  )
}

export default DepositPage
