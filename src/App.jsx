import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import AuthModal from './components/auth/AuthModal';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Parents from './pages/Parents';
import UserType from './pages/UserType';
import Onboarding from './pages/Onboarding';
import AssessmentFlow from './pages/AssessmentFlow';
import Questions from './pages/Questions';
import Class12Questionnaire from './pages/Class12Questionnaire';
import PathResults from './pages/PathResults';
import Recommendations from './pages/Recommendations';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Advisor from './pages/Advisor';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import StudyAbroad from './pages/StudyAbroad';
import Scholarships from './pages/Scholarships';
import Colleges from './pages/Colleges';
import CollegeDetail from './pages/CollegeDetail';
import CollegeCompare from './pages/CollegeCompare';
import SavedColleges from './pages/SavedColleges';
import ScholarshipDetail from './pages/ScholarshipDetail';
import AdminColleges from './pages/AdminColleges';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import CookiePolicy from './pages/legal/CookiePolicy';
import Disclaimer from './pages/legal/Disclaimer';
import Accessibility from './pages/legal/Accessibility';
import AcceptableUse from './pages/legal/AcceptableUse';
import Security from './pages/legal/Security';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Support from './pages/Support';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Offline from './pages/Offline';
import SessionExpired from './pages/SessionExpired';

function RequireAnswers({ children }) {
  const { answers } = useUser();
  const hasAnswers = answers && Object.keys(answers).length > 0;
  if (!hasAnswers) return <Navigate to="/get-started" replace />;
  return children;
}

// No separate login page — /login, /signup, /forgot-password all render the
// normal page as background + auto-open the AuthModal popup on top of it.
function AuthPopupRoute({ mode = 'login' }) {
  const { openAuthModal } = useAuthModal();
  useEffect(() => {
    openAuthModal(mode);
  }, [mode, openAuthModal]);
  return (
    <Layout>
      <Landing />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AuthModalProvider>
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          {/* No separate login page — popup opens over the page, bg stays visible */}
          <Route path="/login" element={<AuthPopupRoute mode="login" />} />
          <Route path="/signup" element={<AuthPopupRoute mode="signup" />} />
          <Route path="/forgot-password" element={<AuthPopupRoute mode="login" />} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          {/* Dedicated How It Works page — split out from About */}
          <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
          <Route path="/career-guidance" element={<Layout><UserType /></Layout>} />
          <Route path="/contact" element={<Layout><Support /></Layout>} />
          <Route path="/parents" element={<Layout><Parents /></Layout>} />
          <Route path="/get-started" element={<Layout><UserType /></Layout>} />
          <Route path="/onboarding/:userType" element={<Layout showFooter={false}><Onboarding /></Layout>} />
          <Route path="/assessment" element={<Layout showFooter={false}><AssessmentFlow /></Layout>} />
          {/* Questionnaire/results aliases — reuse the unified AssessmentFlow
              (questionnaire + results in one flow), same alias pattern as
              /global-study and /career-guidance above. No logic duplicated. */}
          <Route path="/questionnaire" element={<Layout showFooter={false}><AssessmentFlow /></Layout>} />
          <Route path="/results" element={<Layout showFooter={false}><AssessmentFlow /></Layout>} />
          <Route path="/questions/class12" element={<Layout showFooter={false}><Class12Questionnaire /></Layout>} />
          <Route path="/path/:userType" element={<Layout><RequireAnswers><PathResults /></RequireAnswers></Layout>} />
          <Route path="/questions/:userType" element={<Layout showFooter={false}><Questions /></Layout>} />
          <Route path="/recommendations/:userType" element={<Layout><RequireAnswers><Recommendations /></RequireAnswers></Layout>} />
          <Route path="/compare" element={<Layout><Compare /></Layout>} />
          <Route path="/study-abroad" element={<Layout><StudyAbroad /></Layout>} />
          {/* Canonical spec name — same component, no duplicate page */}
          <Route path="/global-study" element={<Layout><StudyAbroad /></Layout>} />
          <Route path="/scholarships" element={<Layout><Scholarships /></Layout>} />
          <Route path="/colleges" element={<Layout><Colleges /></Layout>} />
          <Route path="/colleges/compare" element={<Layout><CollegeCompare /></Layout>} />
          <Route path="/colleges/saved" element={<Layout><SavedColleges /></Layout>} />
          <Route path="/scholarships/:scholarshipId" element={<Layout><ScholarshipDetail /></Layout>} />
          <Route path="/colleges/:slug/scholarships/:scholarshipId" element={<Layout><ScholarshipDetail /></Layout>} />
          <Route path="/colleges/:slug" element={<Layout><CollegeDetail /></Layout>} />
          <Route path="/admin/colleges" element={<Layout><RequireAdmin><AdminColleges /></RequireAdmin></Layout>} />
          {/* Dashboard + Advisor handle their own empty states (assessment CTA via
              CareerAssessmentHero / chat prompts), so they require auth only.
              Gating on local answers here would bounce returning users whose
              results live in Supabase (new device) back to /get-started. */}
          <Route path="/dashboard" element={<Layout><RequireAuth><Dashboard /></RequireAuth></Layout>} />
          <Route path="/advisor" element={<Layout showHeader={false}><RequireAuth><Advisor /></RequireAuth></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/cookies" element={<Layout><CookiePolicy /></Layout>} />
          <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
          <Route path="/accessibility" element={<Layout><Accessibility /></Layout>} />
          <Route path="/acceptable-use" element={<Layout><AcceptableUse /></Layout>} />
          <Route path="/security" element={<Layout><Security /></Layout>} />
          <Route path="/account" element={<Layout><RequireAuth><Account /></RequireAuth></Layout>} />
          <Route path="/verify-email" element={<Layout><VerifyEmail /></Layout>} />
          <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/403" element={<Layout><Forbidden /></Layout>} />
          <Route path="/500" element={<Layout><ServerError /></Layout>} />
          <Route path="/offline" element={<Layout><Offline /></Layout>} />
          <Route path="/session-expired" element={<Layout><SessionExpired /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        {/* Global login popup — opens over current page, URL never changes */}
        <AuthModal />
        </AuthModalProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
