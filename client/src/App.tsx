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

function AppInner() {
  useServiceWorker();
  return (
    <>
      <KccAlertModal />
      <KccApplicationModal />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/machinery-booking" element={<MachineryBookingPage />} />
          <Route path="/mandi-bhav" element={<MandiBhavPage />} />
          <Route path="/agri-market" element={<AgriMarketPage />} />
          <Route path="/sell-crops" element={<SellCropsPage />} />
          <Route path="/labour-booking" element={<LabourBookingPage />} />
          <Route path="/expert-advice" element={<ExpertAdvicePage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/crop-calendar" element={<CropCalendarPage />} />
          <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
          <Route path="/farming-tips" element={<FarmingTipsPage />} />
          <Route path="/kisan-pathshala" element={<KisanPathshalaPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/soil-testing" element={<SoilTestingPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="/admin/:tab/*" element={<AdminPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <AppInner />
    </DefaultProviders>
  );
}
