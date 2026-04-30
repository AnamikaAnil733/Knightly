import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../Pages/Authentication/AuthPage";
import { OTPVerify } from "../Pages/Authentication/EmailVerification";
import { LandingPage } from "../Pages/User/LandingPage";
import { LoginPage } from "../Pages/Authentication/LoginPage";
import { UserManagement } from "../Pages/Admin/UserManagement";
import AdminLayout from "../Pages/Admin/Adminlayout";
import { Profile } from "../Pages/User/Profile";
import FriendsPage from "../Pages/User/FriendsPage";
import { ForgotPassword } from "../Pages/Authentication/ForgetPassword";
import { Settings } from "../Pages/User/Settings";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { PuzzleManagement } from "../Pages/Admin/PuzzleManagement";
import { Match } from "../Pages/User/MatchPage";
import { WaitingRoom } from "../Pages/User/WaitingRoom";
import { GameSelectionPage } from "../Pages/User/GameSelectionPage";
import { PuzzleTactics } from "../Pages/User/PuzzleTactics";
import { PuzzleSolvingPage } from "../Pages/User/PuzzleSolvingPage";
import { GameReviewPage } from "../Pages/User/GameReviewPage";
import { LeaderBoardPage } from "../Pages/User/LeaderBoardPage";
import LearnPage from "../Pages/User/LearnPage";
import LessonListPage from "../Pages/User/LessonListPage";
import LessonPage from "../Pages/User/LessonPage";
import { LessonManagement } from "../Pages/Admin/LessonManagement";
import AboutPage from "../Pages/User/AboutPage";
import BlogListPage from "../Pages/User/BlogListPage";
import BlogDetailPage from "../Pages/User/BlogDetailPage";
import BlogWorkspacePage from "../Pages/User/BlogWorkspacePage";
import BlogManagement from "../Pages/Admin/BlogManagement";
import BlogDashboardPage from "../Pages/User/BlogDashboardPage";
import { LiveGamesPage } from "../Pages/User/LiveGamesPage";
import PricingPage from "../Pages/User/PricingPage";
import SuccessPage from "../Pages/User/SuccessPage";
import CancelPage from "../Pages/User/CancelPage";
import { SubscriptionManagement } from "../Pages/Admin/SubscriptionManagement";
import { TransactionManagement } from "../Pages/Admin/TransactionManagement";
import { LiveGameMonitor } from "../Pages/Admin/LiveGameMonitor";
import { AnalyticsDashboard } from "../Pages/Admin/AnalyticsDashboard";
import { AdminDashboard } from "../Pages/Admin/AdminDashboard";
import { SystemSettings } from "../Pages/Admin/SystemSettings";
import { MaintenancePage } from "../Pages/User/MaintenancePage";
import { ReportManagement } from "../Pages/Admin/ReportManagement";
import { AchievementManagement } from "../Pages/Admin/AchievementManagement";
import { AdminMatchReview } from "../Pages/Admin/AdminMatchReview";
import { useSystemSettings } from "../Context/SystemSettingsContext";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { UserRole } from "../Types/User";

export default function AppRoutes() {
  const { settings, isLoading: isSettingsLoading } = useSystemSettings();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.userAuth);
  const user = auth.user;
  const isAuthLoaded = auth.authLoaded;


  const isMaintenance = settings?.maintenanceMode;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/admin/login";

  if (isSettingsLoading || !isAuthLoaded) {
    return null;
  }

  if (
    isMaintenance &&
    !isAdmin &&
    !isAdminRoute &&
    !isAuthRoute &&
    location.pathname !== "/maintenance"
  ) {
    return <Navigate to="/maintenance" replace />;
  }

  if (!isMaintenance && location.pathname === "/maintenance") {
    return <Navigate to="/landing-page" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage initialMode="SIGNUP" role="USER" />} />
      <Route path="/verify-otp" element={<OTPVerify mode="signup" />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/live" element={<LiveGamesPage />} />
      <Route path="/leaderboard" element={<LeaderBoardPage />} />
      <Route path="/leaderboard/:type" element={<LeaderBoardPage />} />
      <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
      <Route
        path="/user/login"
        element={<AuthPage initialMode="LOGIN" role="USER" />}
      />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/forgot-otp" element={<OTPVerify mode="forgot" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/play" element={<GameSelectionPage />} />
      <Route path="/waiting" element={<WaitingRoom />} />
      <Route path="/match" element={<Match />} />
      <Route path="/match/:gameId" element={<Match />} />
      <Route path="/review/:gameId" element={<GameReviewPage />} />
      <Route path="/puzzles" element={<PuzzleTactics />} />
      <Route path="/puzzle/solve/:difficulty" element={<PuzzleSolvingPage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/learn/:category" element={<LessonListPage />} />
      <Route path="/learn/lesson/:id" element={<LessonPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/payment/success" element={<SuccessPage />} />
      <Route path="/payment/cancel" element={<CancelPage />} />

      {/* Blog Routes */}
      <Route path="/blogs" element={<BlogListPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailPage />} />
      <Route path="/blog/create" element={<BlogWorkspacePage />} />
      <Route path="/blog/edit/:id" element={<BlogWorkspacePage />} />
      <Route path="/dashboard/blogs" element={<BlogDashboardPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="puzzles" element={<PuzzleManagement />} />
        <Route path="lessons" element={<LessonManagement />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="transactions" element={<TransactionManagement />} />
        <Route path="live-games" element={<LiveGameMonitor />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="reports" element={<ReportManagement />} />
        <Route path="reports/review/:gameId" element={<AdminMatchReview />} />
        <Route path="achievements" element={<AchievementManagement />} />
      </Route>
    </Routes>
  );
}
