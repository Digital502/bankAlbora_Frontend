import React from "react";
import { Credit } from '../../components/credit/Credit';
import { NavbarDashboardAdmin } from "../../components/navs/NavbarDashboardAdmin";

export const CreditPage = () => {
    return (
        <div>
            <NavbarDashboardAdmin />
            <Credit />
        </div>
    )
}

export default CreditPage