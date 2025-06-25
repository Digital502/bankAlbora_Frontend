import React from 'react'
import { Product } from '../../components/product/Product' 
import { NavbarDashboarOrganization } from '../../components/navs/NavbarDashboardOrganization'

export const ProductPage = () => {
  return (
    <div>
      <NavbarDashboarOrganization />
      <Product />
    </div>
  )
}

export default ProductPage
