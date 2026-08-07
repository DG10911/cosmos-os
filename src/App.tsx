import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { hasOnboarded } from "./data/user";
import SplashPage from "./pages/SplashPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import TodayPage from "./pages/TodayPage";
import ConsultPage from "./pages/ConsultPage";
import AstrologerPage from "./pages/AstrologerPage";
import SessionPage from "./pages/SessionPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import MissionsPage from "./pages/MissionsPage";
import CirclePage from "./pages/CirclePage";
import CompatPage from "./pages/CompatPage";
import MePage from "./pages/MePage";
import TimelinePage from "./pages/TimelinePage";
import ReplayPage from "./pages/ReplayPage";
import CosmosAIPage from "./pages/CosmosAIPage";
import PredictionsPage from "./pages/PredictionsPage";

/** Redirect first-time users to the splash/onboarding flow. */
function HomeGate() {
  return hasOnboarded() ? (
    <Navigate to="/today" replace />
  ) : (
    <Navigate to="/splash" replace />
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Immersive routes (no app chrome) */}
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/replay" element={<ReplayPage />} />
        <Route path="/twin" element={<CosmosAIPage />} />

        {/* App shell routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeGate />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/consult" element={<ConsultPage />} />
          <Route path="/astrologer/:id" element={<AstrologerPage />} />
          <Route
            path="/session/:id/summary"
            element={<SessionSummaryPage />}
          />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/circle" element={<CirclePage />} />
          <Route path="/circle/compat" element={<CompatPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
