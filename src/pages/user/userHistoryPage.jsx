import { NavbarDashboardUser } from '../../components/navs/NavbarDashboardUser'
import { UserHistory } from '../../components/userHistory/UserHistory'
export const UserHistoryPage = () => {
    return (
        <div>
            <NavbarDashboardUser />
            <UserHistory/>
        </div>
    )
}