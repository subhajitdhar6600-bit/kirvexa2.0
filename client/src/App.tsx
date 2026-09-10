import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { useServiceWorker } from "@/hooks/use-service-worker.ts";
import { KccAlertModal, KccApplicationModal } from "@/components/KccGate.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/login/page.tsx";
import RegisterPage from "./pages/register/page.tsx";
import DashboardPage from "./pages/dashboard/page.tsx";
import MandiBhavPage from "./pages/mandi-bhav/page.tsx";
import AgriMarketPage from "./pages/agri-market/page.tsx";
import SellCropsPage from "./pages/sell-crops/page.tsx";
import LabourBookingPage from "./pages/labour-booking/page.tsx";
import ExpertAdvicePage from "./pages/expert-advice/page.tsx";
import WeatherPage from "./pages/weather/page.tsx";
import WalletPage from "./pages/wallet/page.tsx";
import AboutPage from "./pages/about/page.tsx";
import ContactPage from "./pages/contact/page.tsx";
import BlogPage from "./pages/blog/page.tsx";
import CropCalendarPage from "./pages/crop-calendar/page.tsx";
import GovernmentSchemesPage from "./pages/government-schemes/page.tsx";
import FarmingTipsPage from "./pages/farming-tips/page.tsx";
import HelpCenterPage from "./pages/help-center/page.tsx";
import AdminPage from "./pages/admin/page.tsx";
import NotificationsPage from "./pages/notifications/page.tsx";

import MachineryBookingPage from "./pages/machinery-booking/page.tsx";
import ProfilePage from "./pages/profile/page.tsx";
import CartPage from "./pages/cart/page.tsx";
import KisanPathshalaPage from "./pages/kisan-pathshala/page.tsx";
import ServicesPage from "./pages/services/page.tsx";
import SoilTestingPage from "./pages/soil-testing/page.tsx";
import AuthGate from "./components/AuthGate.tsx";
import RateReviewModal from "./components/RateReviewModal.tsx";

function AppInner() {
  useServiceWorker();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <KccAlertModal />
      <KccApplicationModal />
      <RateReviewModal />
      <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="/admin/:tab/*" element={<AdminPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public Platform & Information Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/crop-calendar" element={<CropCalendarPage />} />
          <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
          <Route path="/farming-tips" element={<FarmingTipsPage />} />
          <Route path="/kisan-pathshala" element={<KisanPathshalaPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />

          {/* Protected Platform & Service Routes (Requires Login / Account) */}
          <Route path="/services" element={<AuthGate><ServicesPage /></AuthGate>} />
          <Route path="/mandi-bhav" element={<AuthGate><MandiBhavPage /></AuthGate>} />
          <Route path="/agri-market" element={<AuthGate><AgriMarketPage /></AuthGate>} />
          <Route path="/weather" element={<AuthGate><WeatherPage /></AuthGate>} />
          <Route path="/dashboard" element={<AuthGate><DashboardPage /></AuthGate>} />
          <Route path="/dealer-dashboard" element={<AuthGate><DashboardPage /></AuthGate>} />
          <Route path="/profile" element={<AuthGate><ProfilePage /></AuthGate>} />
          <Route path="/cart" element={<AuthGate><CartPage /></AuthGate>} />
          <Route path="/wallet" element={<AuthGate><WalletPage /></AuthGate>} />
          <Route path="/sell-crops" element={<AuthGate><SellCropsPage /></AuthGate>} />
          <Route path="/machinery-booking" element={<AuthGate><MachineryBookingPage /></AuthGate>} />
          <Route path="/labour-booking" element={<AuthGate><LabourBookingPage /></AuthGate>} />
          <Route path="/expert-advice" element={<AuthGate><ExpertAdvicePage /></AuthGate>} />
          <Route path="/soil-testing" element={<AuthGate><SoilTestingPage /></AuthGate>} />
          <Route path="/notifications" element={<AuthGate><NotificationsPage /></AuthGate>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <AppInner />
    </DefaultProviders>
  );
}
