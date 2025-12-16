import React, { useState } from 'react'
import { MailIcon, LockIcon, UserIcon,CrownIcon} from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import { sendSignupOtp } from "../../Service/api/authapi";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const signupMutation = useMutation({
    mutationFn: sendSignupOtp,
    onSuccess: (_, variables) => {
      navigate("/verify-otp", {
        state: {
          displayname:formData.displayname,
          email: variables.email,
          password: formData.password,
        },
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      alert(error.response?.data?.message || "Signup failed");
    },
  });
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.displayname || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
   
  signupMutation.mutate({
    displayname: formData.displayname,
    email: formData.email,
    role: "user", // required by backend
  });
  };
  
  const handleGoogleSignup = () => {
    // Handle Google signup logic here
    console.log('Google signup clicked')
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)', }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-600/5 to-transparent rounded-full"></div>
      </div>
      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CrownIcon className="w-10 h-10 text-[#FFD166]" fill="#FFD166" />
            <h1
              className="text-4xl font-bold text-[#FFD166]"
              style={{
                fontFamily: 'Cinzel, serif',
              }}
            >
              Knightly
            </h1>
          </div>
          <p className="text-[#C9CAD9] text-sm">
            Begin your journey to mastery.
          </p>
        </div>
        {/* Card */}
        <div
          className="rounded-2xl p-10 backdrop-blur-md relative"
          style={{
            background: 'rgba(17, 25, 63, 0.85)',
            border: '1px solid transparent',
            backgroundImage:
              'linear-gradient(rgba(17, 25, 63, 0.85), rgba(17, 25, 63, 0.85)), linear-gradient(135deg, #3A6FF7, #6B2EFF)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 0 40px rgba(58, 111, 247, 0.2)',
          }} >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="displayname"
                  value={formData.displayname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(58,111,247,0.4)] transition-all"
                  
                />
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(58,111,247,0.4)] transition-all"
                  
                />
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(58,111,247,0.4)] transition-all"
                
                />
              </div>
            </div>
            {/* Confirm Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(58,111,247,0.4)] transition-all"
                  
                />
              </div>
            </div>
            {/* Create Account Button */}
            <button
       type="submit"
      disabled={signupMutation.isPending || signupMutation.isSuccess}
       className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all
       ${signupMutation.isPending || signupMutation.isSuccess
      ? "opacity-60 cursor-not-allowed"
      : "hover:shadow-[0_0_25px_rgba(58,111,247,0.6)] hover:brightness-110"
       }`}
      style={{
     background: "linear-gradient(90deg, #3A6FF7 0%, #6B2EFF 100%)",
     }}
     >
    {signupMutation.isPending
    ? "Sending OTP..."
    : signupMutation.isSuccess
    ? "OTP Sent"
    : "Create Account"}
       </button>

          </form>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_15px_rgba(106,46,255,0.5)] hover:border-opacity-100"
            style={{
              background: 'rgba(17, 25, 63, 0.6)',
              border: '1px solid rgba(255, 209, 102, 0.4)',
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
          {/* Login Link */}
          <p className="text-center mt-6 text-gray-300">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold transition-all hover:underline hover:shadow-[0_0_10px_rgba(255,209,102,0.4)]"
              style={{
                color: '#FFD166',
              }}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
