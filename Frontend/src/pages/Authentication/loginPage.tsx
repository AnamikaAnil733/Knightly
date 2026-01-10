import React, { useState } from 'react';
import axios from "../../Service/api/axios";
import { useDispatch } from 'react-redux';
import { setAccessToken, setAdmin } from "../../store/slices/auth/adminAuthSlice";
import { setuserAccessToken, setUser } from '../../store/slices/auth/userAuthSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from 'lucide-react';
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast"


type FormValues = {
  email: string;
  password: string;
};

type LoginPageProps = {
  role: "ADMIN" | "USER";
};

interface CredentialResponse {
  clientId?: string;
  credential?: string;
  select_by?: string;
}

export function LoginPage({ role }: LoginPageProps) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post("/auth/login", data);

      if (role === "ADMIN") {
        dispatch(setAccessToken(response.data.userInfo.accessToken));
        dispatch(setAdmin(response.data.userInfo));
        navigate("/admin/users");
      } else {
        dispatch(setuserAccessToken(response.data.userInfo.accessToken));
        dispatch(setUser(response.data.userInfo));
        navigate("/landing-page");
      }

    } catch (error) {
      if(error instanceof Error){
        alert(error.message || "login failed");
      }
    }

  }
  const handleGoogleLogin = async (response:CredentialResponse) => {
    try {
      const token = response.credential; // Google JWT
  
      if (!token) {
        toast.error("No Google token received");
        return;
      }
  
      const res = await axios.post("/auth/googleAuth", {
        token,
        role: "user"
      });
  
      const user = res.data.userInfo;
      const accessToken = res.data.accessToken; // BACKEND TOKEN
  
      // Save into LocalStorage
      localStorage.setItem("userAccessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
  
      if (role === "ADMIN") {
        dispatch(setAccessToken(accessToken));
        dispatch(setAdmin(user));
        navigate("/admin/users");
      } else {
        dispatch(setuserAccessToken(accessToken));
        dispatch(setUser(user));
        navigate("/landing-page");
      }
  
    } catch (error) {
      if(error instanceof Error){

        toast.error("Google Auth Failed")
      }
    }
  }
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0A0F2C] px-4">

      <div className="absolute top-10 left-10 opacity-10 hidden md:block">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="#FFD166">
          <path d="M12,2c-0.5,0-1,0.19-1.41,0.59L8.5,4.67L7.67,3.83L9.08,2.41C9.88,1.61,10.4,1,12,1s2.12,0.61,2.92,1.41l1.41,1.42l-0.83,0.83l-2.09-2.08C13.01,2.19,12.5,2,12,2z M8.5,5.67L12,9.17l3.5-3.5c0.78-0.78,2.05-0.78,2.83,0l0.92,0.92C19.78,7.12,20,7.8,20,8.5c0,1.5-0.59,2.92-1.67,4L16,14.83V22H8v-7.17l-2.33-2.33C4.59,11.42,4,10,4,8.5c0-0.7,0.22-1.38,0.75-1.91l0.92-0.92C6.45,4.88,7.72,4.88,8.5,5.67z M14,20h-4v-5h4V20z" />
        </svg>
      </div>

      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-[#3A6FF7] opacity-20 blur-xl rounded-2xl transform -rotate-3"></div>
        <div className="relative bg-[#11193F] rounded-xl shadow-2xl overflow-hidden z-10">

          <div className="pt-8 pb-6 px-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] rounded-b-lg"></div>
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#0A0F2C] border border-[#3A6FF7]/30 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-[#FFD166]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">
              {role === "ADMIN" ? "Knightly Admin" : "Knightly User Login"}
            </h1>
            <p className="text-[#C9CAD9] text-sm">
              Enter your credentials to access the panel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">

            <div className="mb-6">
              <label className="block text-[#C9CAD9] text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-[#0A0F2C] border ${errors.email ? 'border-[#EF4444]' : 'border-[#3A6FF7]/30'} rounded-lg text-white`}
                placeholder="example@mail.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-[#C9CAD9] text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-[#0A0F2C] border ${errors.password ? 'border-[#EF4444]' : 'border-[#3A6FF7]/30'} rounded-lg text-white pr-10`}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={()=> setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div className="text-right mb-7">
              <a
                href="/forgotpassword"
                className="text-sm text-[#6B2EFF] hover:text-[#FFD166] transition-colors"
              >
                Forgot Password?
              </a>
            </div>
       

            <button type="submit" className="w-full bg-gradient-to-r from-[#FFD166] to-[#FFD166]/90 text-[#0A0F2C] font-medium py-3 rounded-lg">
              Sign In
            </button>

            <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#6B2EFF]"></div>
            <span className="text-[#C9CAD9] text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#6B2EFF]"></div>
          </div>

            <div className="mt-4 mb-4 flex justify-center ">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Auth Failed")}
        />
      </div>

        <p className="text-center text-[#C9CAD9] text-sm mt-6">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-[#FFD166] hover:text-[#6B2EFF] font-semibold transition-colors"
            >
              Sign Up
            </a>
          </p>
         

          </form>

        </div>
      </div>
    </div>
  );
}
