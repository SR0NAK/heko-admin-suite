import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Vendors from "./pages/Vendors";
import DeliveryPartners from "./pages/DeliveryPartners";
import Referrals from "./pages/Referrals";
import Returns from "./pages/Returns";
import Reports from "./pages/Reports";
import CMS from "./pages/CMS";
import UserDetail from "./pages/UserDetail";
import OrderDetail from "./pages/OrderDetail";
import VendorOrders from "./pages/VendorOrders";
import VendorReturns from "./pages/VendorReturns";
import ProductAvailability from "./pages/ProductAvailability";
import VendorHistory from "./pages/VendorHistory";
import VendorSettings from "./pages/VendorSettings";
import Deliveries from "./pages/Deliveries";
import Pickups from "./pages/Pickups";
import DeliveryHistory from "./pages/DeliveryHistory";
import DeliveryEarnings from "./pages/DeliveryEarnings";
import DeliveryProfile from "./pages/DeliveryProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/users/:userId" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
            <Route path="/delivery-partners" element={<ProtectedRoute><DeliveryPartners /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/cms" element={<ProtectedRoute><CMS /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            {/* Vendor Routes */}
            <Route path="/vendor-orders" element={<ProtectedRoute><VendorOrders /></ProtectedRoute>} />
            <Route path="/vendor-returns" element={<ProtectedRoute><VendorReturns /></ProtectedRoute>} />
            <Route path="/product-availability" element={<ProtectedRoute><ProductAvailability /></ProtectedRoute>} />
            <Route path="/vendor-history" element={<ProtectedRoute><VendorHistory /></ProtectedRoute>} />
            <Route path="/vendor-settings" element={<ProtectedRoute><VendorSettings /></ProtectedRoute>} />
            {/* Delivery Partner Routes */}
            <Route path="/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
            <Route path="/pickups" element={<ProtectedRoute><Pickups /></ProtectedRoute>} />
            <Route path="/delivery-history" element={<ProtectedRoute><DeliveryHistory /></ProtectedRoute>} />
            <Route path="/delivery-earnings" element={<ProtectedRoute><DeliveryEarnings /></ProtectedRoute>} />
            <Route path="/delivery-profile" element={<ProtectedRoute><DeliveryProfile /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
