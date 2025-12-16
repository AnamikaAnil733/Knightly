import { BrowserRouter, Routes, Route } from "react-router-dom";
import {SignupPage} from "./pages/Authentication/sighnup"
import { OTP } from "./pages/Authentication/EmailVerification";
import { LandingPage } from "./pages/user/landingPage"
// import {UserManagement} from "./pages/Admin/UserManagment"

// import { VerifyOtpPage } from "./pages/VerifyOtpPage";

function App() {


  return (
    <>
    {/* <LandingPage/> */}
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTP />} />
        <Route path="/landing-page" element={<LandingPage/>}/>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}
export default App
