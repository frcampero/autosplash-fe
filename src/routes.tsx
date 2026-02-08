import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./features/dashboard/pages/DashboardHome";
import Orders from "./features/orders/pages/OrderList";
import CreateOrder from "./features/orders/pages/CreateOrder";
import OrderDetail from "./features/orders/pages/OrderDetail";
import Prices from "./features/prices/pages/Prices";
import Login from "./features/auth/LoginPage";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import PublicOrderView from "./features/orders/pages/PublicOrderView";
import Customers from "./features/customers/pages/Customer";
import CustomerProfile from "./features/customers/pages/CustomerProfile";
import EditCustomerForm from "./features/customers/pages/EditCustomerForm";
import NewCustomerForm from "./features/customers/pages/NewCustomerForm";
import { NotFoundPage } from "./features/auth/NotFoundPage";
import Users from "./features/users/pages/UserList";
import NewUserForm from "./features/users/pages/NewUserForm";
import EditUserForm from "./features/users/pages/EditUserForm";
import SettingsPage from "./features/settings/pages/SettingsPage";

/** Paths de la app (para usar en links y redirects) */
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  ORDERS: "/orders",
  ORDER_NEW: "/orders/nuevo",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  CUSTOMERS: "/customers",
  CUSTOMER_NEW: "/customers/new",
  CUSTOMER_PROFILE: (id: string) => `/customers/${id}`,
  CUSTOMER_EDIT: (id: string) => `/customers/edit/${id}`,
  PRICES: "/prices",
  USERS: "/users",
  USER_NEW: "/users/new",
  USER_EDIT: (id: string) => `/users/edit/${id}`,
  SETTINGS: "/settings",
  PUBLIC_ORDER: (orderId: string) => `/lookup/${orderId}`,
} as const;

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ORDERS} element={<Orders />} />
        <Route path={ROUTES.ORDER_NEW} element={<CreateOrder />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
        <Route path={ROUTES.CUSTOMER_NEW} element={<NewCustomerForm />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
        <Route path="/customers/edit/:id" element={<EditCustomerForm />} />
        <Route path={ROUTES.PRICES} element={<Prices />} />
        <Route path={ROUTES.USERS} element={<Users />} />
        <Route path={ROUTES.USER_NEW} element={<NewUserForm />} />
        <Route path="/users/edit/:id" element={<EditUserForm />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route
        path="/lookup/:orderId"
        element={<PublicOrderView />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
