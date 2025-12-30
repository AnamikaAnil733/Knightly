import React, { useState } from 'react'
import { MailIcon, LockIcon, UserIcon, CrownIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useMutation } from "@tanstack/react-query"
import { sendSignupOtp } from "../../Service/api/authapi"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { useDispatch } from 'react-redux'
import axios from "../../Service/api/axios"
import { setuserAccessToken, setUser } from '../../store/slices/auth/userAuthSlice'
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast"

interface ApiErrorResponse { message: string }
interface CredentialResponse {
  clientId?: string
  credential?: string
  select_by?: string
}

export function SignupPage() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    displayname: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({
    displayname: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const signupMutation = useMutation({
    mutationFn: sendSignupOtp,
    onSuccess: (_, variables) => {
      navigate("/verify-otp", {
        state: {
          displayname: formData.displayname,
          email: variables.email,
          password: formData.password,
        }
      })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || "Signup failed")
    }
  })


  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.displayname.trim()) newErrors.displayname = "Full name required"
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Enter valid email"

    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    setErrors(prev => ({ ...prev, [e.target.name]: "" })) // remove error on typing
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    signupMutation.mutate({
      displayname: formData.displayname,
      email: formData.email,
      role: "user"
    })
  }


  const handleGoogleLogin = async (response: CredentialResponse) => {
    try {
      const token = response.credential
      if (!token) return toast.error("No Google token received")

      const res = await axios.post("/auth/googleAuth", { token, role: "user" })
      const user = res.data.userInfo
      const accessToken = res.data.accessToken

      localStorage.setItem("userAccessToken", accessToken)
      localStorage.setItem("user", JSON.stringify(user))

      dispatch(setuserAccessToken(accessToken))
      dispatch(setUser(user))

      navigate("/landing-page")
    } catch{
      toast.error("Google login failed")
    }
  }



  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)' }}>

      <div className="relative z-10 w-full max-w-md px-6">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CrownIcon className="w-10 h-10 text-[#FFD166]" fill="#FFD166" />
            <h1 className="text-4xl font-bold text-[#FFD166]" style={{ fontFamily: 'Cinzel, serif' }}>
              Knightly
            </h1>
          </div>
          <p className="text-[#C9CAD9] text-sm"> Begin your journey to mastery. </p>
        </div>


        <div className="rounded-2xl p-10 backdrop-blur-md relative"
          style={{
            background: 'rgba(17, 25, 63, 0.85)',
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(rgba(17, 25, 63, 0.85), rgba(17, 25, 63, 0.85)), linear-gradient(135deg, #3A6FF7, #6B2EFF)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 0 40px rgba(58, 111, 247, 0.2)'
          }}>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-white text-sm font-medium">Full Name</label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" name="displayname" value={formData.displayname}
                  onChange={handleChange} placeholder="Enter your full name"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />
              </div>
              {errors.displayname && <p className="text-red-400 text-xs mt-1">{errors.displayname}</p>}
            </div>


            <div>
              <label className="text-white text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter your email"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>


            <div>
              <label className="text-white text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Create password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white" />

                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>


            <div>
              <label className="text-white text-sm font-medium">Confirm Password</label>
              <div className="relative mt-1">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white" />

                <button type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                  {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>


            <button type="submit"
              disabled={signupMutation.isPending}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg
              ${signupMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}`}
              style={{ background: "linear-gradient(90deg,#3A6FF7,#6B2EFF)" }}>
              {signupMutation.isPending ? "Sending OTP..." : "Create Account"}
            </button>
          </form>


          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600" />
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Auth Failed")} />
          </div>

          <p className="text-center mt-6 text-gray-300">
            Already have an account?
            <a href="/user/login" className="text-[#FFD166] font-semibold hover:underline"> Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}
