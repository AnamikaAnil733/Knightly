import { Routes, Route } from "react-router-dom";
import { SignupPage } from "../Pages/Authentication/Signup";
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/verify-otp" element={<OTPVerify mode="signup" />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/leaderboard" element={<LeaderBoardPage />} />
      <Route path="/leaderboard/:type" element={<LeaderBoardPage />} />
      <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
      <Route path="/user/login" element={<LoginPage role="USER" />} />
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

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="users" element={<UserManagement />} />
        <Route path="puzzles" element={<PuzzleManagement />} />
        <Route path="lessons" element={<LessonManagement />} />
      </Route>
    </Routes>
  );
}
