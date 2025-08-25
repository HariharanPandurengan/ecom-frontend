import React, { FormEvent, useEffect, useState } from "react";
import "../App.css";
import Header from "./Header,Footer/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Extend Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}

// Import Firebase SDK (Modular v9+)
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDZQajS9_CnRD9xSU0wl6wkHbcyO9sCg2I",
  authDomain: "nirah-f6509.firebaseapp.com",
  projectId: "nirah-f6509",
  storageBucket: "nirah-f6509.firebasestorage.app",
  messagingSenderId: "576534215594",
  appId: "1:576534215594:web:e6f09402d5860d0610c9d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const primaryColor = "#7B3F14";
const accentColor = "#C8A165";
const fontFamily = "Playfair-display, sans-serif";

const CustomerOTPLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    setupRecaptcha();
  }, []);
  // Setup Recaptcha
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
  };


  const setPhoneNumber = (value : string) => {
    // Allow only digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setupRecaptcha();
    }
  }
  // Send OTP
  const sendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;

      const fullPhone = `+91${phone}`; // Change +91 if you want international format
      console.log(auth);
    //   signInWithPhoneNumber(auth, fullPhone, appVerifier)
    //   .then((confirmationResult) => {
    //   // SMS sent. Prompt user to type the code from the message, then sign the
    //   // user in with confirmationResult.confirm(code).
    //   window.confirmationResult = confirmationResult;
    //   // ...
    // }).catch((error) => {
    //   // Error; SMS not sent
    //   // ...
    // });
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      console.log(result);
      setConfirmationResult(result);
      setStep("otp");
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        // Save session
        localStorage.setItem("userLogin", "true");
        localStorage.setItem("authTokenUser", await user.getIdToken());
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("userId", user.uid);

        alert("Login successful! Redirecting...");
        navigate("/Home");
      } else {
        alert("Please request OTP first.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7]"
      style={{ fontFamily }}
    >
      <Header />
      <div
        className="customer-login-card w-full max-w-md p-8 rounded shadow mt-8"
        style={{
          background: "#fff",
          border: `1px solid ${accentColor}`,
        }}
      >
        <form onSubmit={step === "phone" ? sendOtp : verifyOtp}>
          <h1 className="text-2xl mb-4 font-bold" style={{ fontFamily }}>
            {step === "phone" ? "Login with Phone" : "Enter OTP"}
          </h1>

          {step === "phone" && (
            <div className="mb-4">
              <label
                className="block mb-1 text-base font-normal"
                style={{ color: "#222", fontFamily: "Lato", letterSpacing: "0.01em" }}
                htmlFor="phone"
              >
                Phone Number
              </label>
              <input
                className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                style={{ background: "#FCFAF7", fontFamily: "Lato" }}
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value) }
                required
              />
            </div>
          )}

          {step === "otp" && (
            <div className="mb-4">
              <label
                className="block mb-1 text-base font-normal"
                style={{ color: "#222", fontFamily: "Lato", letterSpacing: "0.01em" }}
                htmlFor="otp"
              >
                Enter OTP
              </label>
              <input
                className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal tracking-widest text-center"
                style={{ background: "#FCFAF7", fontFamily: "Lato", fontSize: "1.3rem" }}
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </div>
          )}
          <div id="recaptcha-container"></div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded font-bold"
            style={{
              background: primaryColor,
              color: "#fff",
              fontFamily,
              fontSize: "1.1rem",
              letterSpacing: "1px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : step === "phone" ? "Send OTP" : "Verify OTP"}
          </button>
        </form>

        {/* Firebase Recaptcha container */}
      </div>
    </div>
  );
};

export default CustomerOTPLogin;