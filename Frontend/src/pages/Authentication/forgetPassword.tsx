import React, { useState } from 'react'
import { ChevronLeft, Crown } from 'lucide-react'
import axios from "../../Service/api/axios";
import { useNavigate } from 'react-router-dom'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post("/auth/forget-password", { email })
      setLoading(false)
      navigate("/forgot-otp", { state:{ email } });// move to OTP screen
    } catch (err: any) {
      setLoading(false)
      alert(err?.response?.data?.message || "Something went wrong")
    }
  }

  const handleBackToLogin = () => {
    navigate("/user/login")
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0A0F2C] overflow-hidden flex items-center justify-center">

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>

      {/* Floating light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6B2EFF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3A6FF7]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Silhouette */}
      <div className="absolute bottom-0 right-0 opacity-5">
        <Crown className="w-96 h-96 text-[#FFD166]" strokeWidth={0.5} />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-10 h-10 text-[#FFD166]" fill="#FFD166" />
            <h1 className="text-4xl font-bold text-[#FFD166]" style={{ fontFamily: 'Cinzel, serif' }}>
              Knightly
            </h1>
          </div>

          <h2 className="text-3xl font-semibold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Forgot your password?
          </h2>
          <p className="text-[#C9CAD9]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Don't worry. We'll help you reset it.
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-[#11193F]/80 backdrop-blur-sm rounded-2xl p-10 border border-transparent"
             style={{ boxShadow: '0px 0px 12px rgba(106,46,255,0.3)', borderImage: 'linear-gradient(135deg, #3A6FF7, #6B2EFF) 1' }}>
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3A6FF7] via-[#6B2EFF] to-[#3A6FF7] opacity-20 blur-sm -z-10"></div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-white mb-3 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Enter your registered email address
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full bg-transparent border border-[#6B2EFF] rounded-xl px-4 py-3 text-white 
                           placeholder-gray-500 focus:outline-none focus:border-[#3A6FF7] 
                           focus:shadow-[0_0_8px_rgba(58,111,247,0.5)] transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-bold py-3 rounded-xl 
                         hover:shadow-[0_0_12px_rgba(106,46,255,0.6)] transition-all duration-300 hover:scale-[1.02]"
              style={{ fontFamily: 'Poppins, sans-serif', boxShadow: '0px 0px 8px rgba(106, 46, 255, 0.4)' }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 text-[#FFD166] hover:underline transition-all duration-300 mt-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Login
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
