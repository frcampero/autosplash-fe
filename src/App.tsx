import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTickets";
import TicketDetail from "./pages/TicketDetail";
import Prices from "./pages/Prices";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import PublicRoute from "./components/PublicRoute";
import PublicOrderPage from "./pages/OrderPublicPage";

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