import { BrowserRouter, Routes, Route } from "react-router-dom";
import {SignupPage} from "./pages/Authentication/sighnup"
import { OTPVerify } from "./pages/Authentication/EmailVerification";
import { LandingPage } from "./pages/user/landingPage";
import {LoginPage} from "./pages/Authentication/loginPage";
import {UserManagment} from "./pages/Admin/UserManagment";
import  AdminLayout from "./pages/Admin/adminlayout";
import { Profile } from "./pages/user/profile";
import {ForgotPassword} from "./pages/Authentication/forgetPassword";
import {ResetPassword} from"./pages/Authentication/changePassword";
import { Toaster } from "react-hot-toast";


function App() {


  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
  
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTPVerify mode="signup" />} /> 
        <Route path="/landing-page" element={<LandingPage/>}/>
        <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
        <Route path="/user/login" element={<LoginPage role="USER" />} />
        <Route path="/user/profile"    element={<Profile/>}/>
        <Route path="/forgotpassword"  element={<ForgotPassword/>}/>
        <Route path="/forgot-otp" element={<OTPVerify mode="forgot" />} />
        <Route path = "/reset-password" element={<ResetPassword/>}/>
        
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserManagment/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
    
    </>
  )
}
export default App
