import { AuthPage } from "../src/pages/auth/AuthPage";
import { HomePage } from "../src/pages/home/HomePage";
import { Card } from "./components/card/Card";
import { CardManagement } from "./components/card/CardManagement";
import { MyCards } from "./components/card/MyCards";
import { DashboardAdminPage } from "./pages/dashboardAdmin";
import { DashboardOrganizationPage } from "./pages/dashboardOrganization/DashboardOrganizationPage";
import { DashboardUserPage } from "./pages/dashboardUser";
import { DepositHistoryPage } from "./pages/deposit/DepositHistoryPage";
import { DepositPage } from "./pages/deposit/DepositPage";
import { FavoriteAccountPage } from "./pages/favoriteAccount/FavoriteAccountPage";
import { OrganizationPage } from "./pages/organization/OrganizationPage";
import { ProfilePageAdmin } from "./pages/profile/ProfileAdminPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ReceivedPage } from "./pages/received/ReceivedPage";
import { DepositUser } from "./components/deposit/DepositUser"; 
import { NotificationPage } from './pages/notification/notificationPage';
import { RegisterOrganizationPage } from "./pages/register/RegisterOrgnizationPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { ServiceAdminPage } from "./pages/service/ServiceAdminPage";
import { UserHistoryPage } from "./pages/user/userHistoryPage";
import { UserPage } from "./pages/user/UserPage";
import { CreditPage } from "./pages/credit/CreditPage"
import { CreditUser } from "./components/credit/CreditUser";
import { InvestmentAdmin } from "./pages/investmentPolicy/investmentPolicyPage";
import { InvestmentsUser } from "./pages/investments/investmentsUserPage";
import { KnowMorePage } from "./pages/knowMore/KnowMorePage";
import { YouSevices } from "./pages/yourServices/yourServicesPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ProductPage } from "./pages/product/ProductPage";
import { InsuranceAdminPage } from "./pages/insurance/InsuranceAdminPage";
import { InsuranceBase } from "./components/insurance/InsuranceUser";
import { MyOrganizationAccount } from "./components/organization/MyAccountOrganization";
import { DepositOrganization } from "./components/organization/DespositOrganization";
import { ProfilePageOrganization } from "./pages/profile/ProfileOrganizationPage";
import { ListProductUser } from "./components/product/ListProductUser";
import { ProductListAdminPage } from "./pages/product/ProductListAdminPage"
import { ProductListPage } from "./pages/product/ProductListPage";
import { ProductListServicePage } from "./pages/product/ProductListServicePage";

export const routes = [
    {path: '/', element: <HomePage/>},
    {path: '/register', element: <RegisterPage/>},
    {path: '/auth', element: <AuthPage/>},
    {path: '/administrator', element: <DashboardAdminPage/>},
    {path: '/bankAlbora', element: <DashboardUserPage/>},
    {path: '/users-administrator', element: <UserPage/> },
    {path: '/profile', element: <ProfilePage/>},
    {path: '/profileAdmin', element: <ProfilePageAdmin/>},
    {path: '/favoriteAccounts', element: <FavoriteAccountPage/>},
    {path: '/deposit', element: <DepositPage/> },
    {path: '/history', element: <DepositHistoryPage/> },
    {path: '/user/received', element: <ReceivedPage/>},
    {path: '/user/deposit', element: <DepositUser/> },
    {path: '/notifications', element: <NotificationPage/>},
    {path: '/service-administrator', element: <ServiceAdminPage/> },
    {path: '/emitir-tarjeta', element: <Card /> },
    {path: '/registerOrganization', element: <RegisterOrganizationPage /> },
    {path: '/organization-administrator', element: <OrganizationPage /> },
    {path: '/organization', element: <DashboardOrganizationPage /> },
    {path: '/tarjetas-management', element: <CardManagement/>},
    {path: '/myCards', element: <MyCards/>},
    {path: "/user/history", element: <UserHistoryPage/> },
    {path: '/user/deposit', element: <DepositUser/> },
    {path: '/admin/credit', element: <CreditPage/> },
    {path: '/prestamos' , element: <CreditUser/>},
    {path: '/servicios/cuentas-de-inversion', element: <InvestmentAdmin /> },
    {path: '/servicios/inversiones', element: <InvestmentsUser  /> },
    {path: '/knowMore', element: <KnowMorePage/>},
    {path: '/user/servicios', element: <YouSevices/>},
    {path: '/forgot-password', element: <ForgotPasswordPage/> },
    {path: '/product', element: <ProductPage/> },
    {path: '/insurance-administrator', element: <InsuranceAdminPage/> },
    {path: '/servicios/seguros', element: <InsuranceBase/> },
    {path: '/myAccounOrganization', element: <MyOrganizationAccount/> },
    {path: '/depositsOrganization', element: <DepositOrganization/> },
    {path: '/profileOrganization', element: <ProfilePageOrganization/> },
    {path: '/product-list-all', element: <ProductListServicePage />},
    {path: '/products/:organizacionId', element: <ListProductUser />},
    {path: '/product-list-admin', element: <ProductListAdminPage />},
    {path: '/product-list', element: <ProductListPage/> }

]