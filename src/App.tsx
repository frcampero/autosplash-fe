import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./features/dashboard/pages/DashboardHome";
import Orders from "./features/orders/pages/OrderList";
import CreateOrder from "./features/orders/pages/CreateOrder";
import OrderDetail from "./features/orders/pages/OrderDetail";
import Prices from "./features/prices/pages/Prices";
import Login from "./features/auth/LoginPage";
import PrivateRoute from "./components/routes/PrivateRoute";
import { Toaster } from "sonner";
import PublicRoute from "./components/routes/PublicRoute";
import PublicOrderView from "./features/orders/pages/PublicOrderView";
import Customers from "./features/customers/pages/Customer";
import CustomerProfile from "./features/customers/pages/CustomerProfile";
import EditCustomerForm from "./features/customers/pages/EditCustomerForm";
import NewCustomerForm from "./features/customers/pages/NewCustomerForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
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
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/nuevo" element={<CreateOrder />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<NewCustomerForm />} />
            <Route path="/customers/:id" element={<CustomerProfile />} />
            <Route path="/customers/edit/:id" element={<EditCustomerForm />} />
            <Route path="/prices" element={<Prices />} />
          </Route>

          {/* Ruta pública */}
          <Route path="/lookup/:orderId" element={<PublicOrderView />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
