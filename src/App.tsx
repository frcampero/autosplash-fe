import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/home/Home";
import Tickets from "./pages/tickets/Tickets";
import CreateTicket from "./pages/tickets/CreateTickets";
import TicketDetail from "./pages/tickets/TicketDetail";
import Prices from "./pages/prices/Prices";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import PublicRoute from "./components/PublicRoute";
import PublicOrderPage from "./pages/orders/OrderPublicPage";
import Customers from "./pages/customers/Customer";
import EditCustomerForm from "./pages/customers/EditCustomerForm";

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
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/nuevo" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/clientes/:id" element={<EditCustomerForm />} />
            <Route path="/precios" element={<Prices />} />
          </Route>

          {/* Ruta pública */}
          <Route path="/orders/:id" element={<PublicOrderPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
