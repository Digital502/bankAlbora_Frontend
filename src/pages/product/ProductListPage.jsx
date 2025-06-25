import React from 'react'
import { ListProduct } from '../../components/product/ListProduct' 
import { NavbarDashboarOrganization } from '../../components/navs/NavbarDashboardOrganization'

export const ProductListPage = () => {
  return (
    <div>
      <NavbarDashboarOrganization />
      <ListProduct />
    </div>
  )
}

export default ProductListPage
