import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2Icon, XCircleIcon, CrownIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../../Service/api/axios"; 
import { KnightlyParticles } from "../../utils/Particle";

/* -------- Types --------*/
interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface RegisterPayload {
  displayname: string;
  email: string;
  password: string;
}

interface ApiErrorResponse { message: string; }

interface OTPVerifyProps {
  mode: "signup" | "forgot";   // NEW
}

/* -------- API -------- */
const verifyOtpRequest = async (data: VerifyOtpPayload) =>
  (await api.post("/auth/verify-otp", data)).data;

const registerRequest = async (data: RegisterPayload) =>
  (await api.post("/auth/register", data)).data;

/* -------- Component -------- */
export function OTPVerify({ mode }: OTPVerifyProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Signup flow: displayname & password
  // Forgot flow: only email required
  const { email, displayname, password } = location.state || {};

  useEffect(() => {
    if (!email) navigate("/signup");
    if (mode === "signup" && (!password || !displayname)) navigate("/signup");
  }, []);

  /* State */
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState<{ type:"success"|"error"|null;text:string }>({ type:null,text:"" });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Timer */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(()=> setTimer(p=>p-1),1000);
    return ()=>clearInterval(interval);
  }, [timer]);

  /* -------- Register Mutation (used only for signup) -------- */
  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => navigate("/user/login"),
    onError: () => setMessage({ type:"error", text:"Account creation failed." })
  });


  /* -------- Resend OTP Mutation -------- */
const resendOtpRequest = async (email:string) => {
  return api.post("/auth/resend-otp", { email }); // Backend route must exist
};

const resendOtpMutation = useMutation({
  mutationFn: () => resendOtpRequest(email),
  onSuccess: () => {
    setMessage({ type:"success", text:"OTP resent successfully!" });
    setTimer(300);                       // restart timer
    setOtp(["","","","","","",""]);      // clear input boxes
    inputRefs.current[0]?.focus();
  },
  onError: () => {
    setMessage({ type:"error", text:"Failed to resend OTP" });
  }
});

  /* -------- Verify OTP Mutation -------- */
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: () => {
      if(mode === "signup"){
        setMessage({ type:"success", text:"OTP Verified. Creating account..." });
        registerMutation.mutate({ displayname,email,password });
      } 
      else if(mode === "forgot"){
        navigate("/reset-password",{ state:{ email }});
      }
    },
    onError:(error:AxiosError<ApiErrorResponse>)=>{
      setMessage({ type:"error", text:error.response?.data.message || "Invalid OTP"});
      setOtp(["","","","","","",""]);
      inputRefs.current[0]?.focus();
    }
  });

  /* Handlers */
  const handleChange = (index:number,value:string)=>{
    if(!/^\d*$/.test(value)) return;
    const newOtp=[...otp];
    newOtp[index]=value.slice(-1);
    setOtp(newOtp);
    if(value && index<6) inputRefs.current[index+1]?.focus();
    setMessage({type:null,text:""});
  };

  const handleVerify = ()=>{
    const otpString = otp.join("");
    if(otpString.length !== 7){
      setMessage({type:"error",text:"Enter all digits"});
      return;
    }
    verifyOtpMutation.mutate({ email, otp: otpString });
  };

  const handleResend=()=>{
    if(timer===0){
      setTimer(300);
      setOtp(["","","","","","",""]);
      setMessage({type:null,text:""});
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden bg-knightly-gradient">
      <KnightlyParticles />

      <header className="pt-12 pb-6 text-center">
        <div className="flex justify-center gap-2 mb-1">
          <CrownIcon className="w-10 h-10 text-gold"/>
          <h1 className="text-4xl text-gold font-bold">Knightly</h1>
        </div>
        <p className="text-gray-light text-sm">
          OTP sent to <b>{email}</b>
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-navy-midnight/85 rounded-2xl">
          <h2 className="text-gold text-center text-2xl mb-5">
            {mode === "signup" ? "Verify Your Account" : "Verify Email"}
          </h2>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit,i)=>(
              <input key={i}
                ref={(el)=>inputRefs.current[i]=el}
                type="text" maxLength={1} value={digit}
                onChange={(e)=>handleChange(i,e.target.value)}
                className="w-12 h-14 text-2xl text-center bg-navy-deep text-white border border-purple rounded-xl"
              />
            ))}
          </div>

          <div className="text-center mb-4">
            {timer>0 ? (
              <span className="text-sm text-gray-light">
                Resend in {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,"0")}
              </span>
            ) : (
              <button 
              onClick={() => resendOtpMutation.mutate()} 
              className="text-gold underline text-sm hover:opacity-80"
            >
              Resend OTP
            </button>
            
            )}
          </div>

          {message.type && (
            <p className={`flex items-center gap-2 justify-center mb-2 
              ${message.type === "success" ? "text-green-400":"text-red-400"}`}>
              {message.type === "success" ? <CheckCircle2Icon/>:<XCircleIcon />}
              {message.text}
            </p>
          )}

          <button
            onClick={handleVerify}
            className="w-full py-3 rounded-xl bg-button-gradient font-semibold text-white"
            disabled={verifyOtpMutation.isPending || registerMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Verifying..." :
             registerMutation.isPending ? "Creating Account..." :
             "Verify OTP"}
          </button>
        </div>
      </main>
    </div>
  );
}
