import React, { useState } from 'react'
import {
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ShieldIcon,
  ChevronLeftIcon,
} from 'lucide-react'
import axios from '../../Service/api/axios'
import { useNavigate,useLocation } from 'react-router-dom'



export function ResetPassword() {
  const navigate = useNavigate()
  const { email } = useLocation().state; 
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  // Password validation
  const hasMinLength = newPassword.length >= 8
  const hasNumber = /\d/.test(newPassword)
  const hasCapital = /[A-Z]/.test(newPassword)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const allRequirementsMet =
    hasMinLength && hasNumber && hasCapital && hasSymbol
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
    
      if (!allRequirementsMet) {
        setError("Please meet all password requirements");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    
      try {
        const res = await axios.post("/auth/reset-password", {
          email,          // received from OTP page
          password: newPassword
        });
    
        setIsSuccess(true);
        setTimeout(() => navigate("/user/login"), 2000); // redirect to login
    
      } catch (error) {
        setError("Failed to reset password. Try again.");
      }
    };
    
  if (isSuccess) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)',
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, #6B2EFF 0%, transparent 70%)',
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, #3A6FF7 0%, transparent 70%)',
            }}
          ></div>
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8">
            <CheckCircleIcon
              className="w-20 h-20 mx-auto mb-4 animate-bounce"
              style={{
                color: '#FFD166',
              }}
            />
          </div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #FFD166 0%, #3A6FF7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Password Reset Successful!
          </h1>
          <p
            className="text-lg mb-8"
            style={{
              color: '#C9CAD9',
            }}
          >
            Your password has been reset successfully. You can now log in to
            your account.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(90deg, #3A6FF7 0%, #6B2EFF 100%)',
              boxShadow: '0 0 20px rgba(58, 111, 247, 0.5)',
            }}
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        background: 'linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #6B2EFF 0%, transparent 70%)',
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #3A6FF7 0%, transparent 70%)',
          }}
        ></div>
        {/* Chess knight silhouette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <ShieldIcon
            className="w-96 h-96"
            style={{
              color: '#FFD166',
            }}
          />
        </div>
      </div>
      {/* Header */}
      <div className="relative z-10 text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-3">
          <ShieldIcon
            className="w-10 h-10"
            style={{
              color: '#FFD166',
            }}
          />
          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#FFD166',
            }}
          >
            Knightly
          </h1>
        </div>
        <p
          className="text-lg"
          style={{
            color: '#C9CAD9',
          }}
        >
          Reset your password to continue your royal journey.
        </p>
      </div>
      {/* Main Reset Card */}
      <div
        className="relative z-10 w-full max-w-md p-10 rounded-2xl backdrop-blur-lg animate-fade-in"
        style={{
          background: 'rgba(17, 25, 63, 0.85)',
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(rgba(17, 25, 63, 0.85), rgba(17, 25, 63, 0.85)), linear-gradient(135deg, #3A6FF7, #6B2EFF)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 0 40px rgba(58, 111, 247, 0.3)',
        }}
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{
            background: 'linear-gradient(90deg, #FFD166 0%, #3A6FF7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create New Password
        </h2>
        <p
          className="text-center mb-8"
          style={{
            color: '#C9CAD9',
          }}
        >
          Enter a new password below and confirm to secure your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div className={shake ? 'animate-shake' : ''}>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: '#C9CAD9',
              }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 focus:shadow-lg"
                style={{
                  background: 'rgba(10, 15, 44, 0.9)',
                  border: '1.5px solid #6B2EFF',
                  boxShadow: '0 0 0 0 rgba(58, 111, 247, 0)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid #3A6FF7'
                  e.target.style.boxShadow = '0 0 20px rgba(58, 111, 247, 0.4)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1.5px solid #6B2EFF'
                  e.target.style.boxShadow = '0 0 0 0 rgba(58, 111, 247, 0)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {/* Confirm Password Field */}
          <div className={shake ? 'animate-shake' : ''}>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: '#C9CAD9',
              }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 outline-none transition-all duration-300 focus:shadow-lg"
                style={{
                  background: 'rgba(10, 15, 44, 0.9)',
                  border: '1.5px solid #6B2EFF',
                  boxShadow: '0 0 0 0 rgba(58, 111, 247, 0)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid #3A6FF7'
                  e.target.style.boxShadow = '0 0 20px rgba(58, 111, 247, 0.4)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1.5px solid #6B2EFF'
                  e.target.style.boxShadow = '0 0 0 0 rgba(58, 111, 247, 0)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {/* Password Requirements */}
          <div
            className="space-y-2 text-sm"
            style={{
              color: '#C9CAD9',
            }}
          >
            <p className="font-medium mb-2">Password must include:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircleIcon
                  className="w-4 h-4"
                  style={{
                    color: hasMinLength ? '#FFD166' : '#C9CAD9',
                  }}
                />
                <span
                  style={{
                    color: hasMinLength ? '#FFD166' : '#C9CAD9',
                  }}
                >
                  8+ characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon
                  className="w-4 h-4"
                  style={{
                    color: hasNumber ? '#FFD166' : '#C9CAD9',
                  }}
                />
                <span
                  style={{
                    color: hasNumber ? '#FFD166' : '#C9CAD9',
                  }}
                >
                  1 number
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon
                  className="w-4 h-4"
                  style={{
                    color: hasCapital ? '#FFD166' : '#C9CAD9',
                  }}
                />
                <span
                  style={{
                    color: hasCapital ? '#FFD166' : '#C9CAD9',
                  }}
                >
                  1 capital letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon
                  className="w-4 h-4"
                  style={{
                    color: hasSymbol ? '#FFD166' : '#C9CAD9',
                  }}
                />
                <span
                  style={{
                    color: hasSymbol ? '#FFD166' : '#C9CAD9',
                  }}
                >
                  1 symbol
                </span>
              </div>
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="text-center text-red-400 text-sm font-medium animate-shake">
              {error}
            </div>
          )}
          {/* Reset Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(90deg, #3A6FF7 0%, #6B2EFF 100%)',
              boxShadow: '0 0 20px rgba(58, 111, 247, 0.5)',
            }}
          >
            Reset Password
          </button>
          {/* Back to Login Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => console.log('Navigate to login')}
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:underline"
              style={{
                color: '#FFD166',
              }}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </form>
      </div>
      {/* Footer */}
      <div
        className="relative z-10 mt-8 text-center text-sm"
        style={{
          color: '#C9CAD9',
        }}
      >
        <p className="mb-2">© 2025 Knightly. All Rights Reserved.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            className="transition-colors"
            style={{
              color: '#C9CAD9',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD166')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C9CAD9')}
          >
            Privacy Policy
          </button>
          <span>|</span>
          <button
            className="transition-colors"
            style={{
              color: '#C9CAD9',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD166')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C9CAD9')}
          >
            Terms
          </button>
          <span>|</span>
          <button
            className="transition-colors"
            style={{
              color: '#C9CAD9',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD166')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C9CAD9')}
          >
            Support
          </button>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@400;600;700&family=Inter:wght@400;500&display=swap');
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        * {
          font-family: 'Inter', sans-serif;
        }
        h1, h2 {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  )
}
