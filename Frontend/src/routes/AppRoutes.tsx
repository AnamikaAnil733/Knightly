import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupPage } from "../pages/Authentication/sighnup";
import { OTPVerify } from "../pages/Authentication/EmailVerification";
import { LandingPage } from "../pages/user/landingPage";
import { LoginPage } from "../pages/Authentication/loginPage";
import { UserManagment } from "../pages/Admin/UserManagment";
import AdminLayout from "../pages/Admin/adminlayout";
import { Profile } from "../pages/user/profile";
import { ForgotPassword } from "../pages/Authentication/forgetPassword";
import { ResetPassword } from "../pages/Authentication/changePassword";
import { Settings } from "../pages/user/setting";
import AdminProtectedRoute from "./AdminProtectedRoute";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTPVerify mode="signup" />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
        <Route path="/user/login" element={<LoginPage role="USER" />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgot-otp" element={<OTPVerify mode="forgot" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route
  path="/admin"
  element={
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  }
>
  <Route path="users" element={<UserManagment />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}
