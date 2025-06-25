import React from 'react'
import { DepositHistory } from '../../components/deposit/DepositHistory'
import { NavbarDashboardAdmin } from '../../components/navs/NavbarDashboardAdmin'

export const DepositHistoryPage = () => {
  return (
    <div>
      <NavbarDashboardAdmin />
      <DepositHistory />
    </div>
  )
}

export default DepositHistoryPage
