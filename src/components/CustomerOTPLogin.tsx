import React, { FormEvent, useState } from "react";
import "../App.css";
import Header from "./Header,Footer/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { height } from "@fortawesome/free-solid-svg-icons/faSearch";

const primaryColor = "#7B3F14";
const accentColor = "#C8A165";
const fontFamily = "Playfair-display, sans-serif";

const CustomerOTPLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [verificationSid, setVerificationSid] = useState<string>("");

  const setPhoneNumber = (value: string) => {
    // Allow only digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  // Send OTP using Twilio
  const sendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}mobileOTPVerification`,
        {
          headers: {
            phonenumber: phone,
          }
        }
      );
      
      if (response.data.status) {
        setVerificationSid(response.data.verificationSid);
        setStep("otp");
        alert("OTP sent successfully!");
      } else {
        alert(response.data.message || "Failed to send OTP!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP using Twilio
  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // You'll need to create this API endpoint for OTP verification
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}verifyMobileOTP`,
        {
          phonenumber: phone,
          code: otp
        }
      );

      const userExists = await verifyUserInDatabase(phone);
      if (userExists) {
        redirectToHome();
        return;
      } else if (response.data.status) {
        addUserToDatabase(phone);
      } else {
        alert(response.data.message || "Invalid OTP. Please try again.");
      }

    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addUserToDatabase = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}addUserbyPhoneNumber`,
        { phone: phoneNumber }
      );
      if (response.data.status) {
        console.log("User added to database");
        verifyUserInDatabase(phoneNumber).then((exists) => {
          if (exists) {
            redirectToHome();
          } else {
            console.error("User verification failed after addition");
          }
        });
      } else {
        console.error("Failed to add user to database");
      }
    } catch (error) {
      console.error("Error adding user to database:", error);
    }
  };

  const verifyUserInDatabase = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}getUserbyPhoneNumber`,
        { phone: phoneNumber }
      );
      console.log("User verification response:", response.data);
      sessionStorage.setItem('userId',response.data.user._id)
      localStorage.setItem('authTokenUser',response.data.authToken)
      return response.data;
    }
    catch (error) {
      console.error("Error verifying user in database:", error);
      return false;
    }
  };

  const redirectToHome = () => {
        localStorage.setItem("userLogin", "true");
        localStorage.setItem("userPhoneNumber", phone);
        localStorage.setItem("loginTimestamp", Date.now().toString());
        // Optional: Store verification status
        sessionStorage.setItem("isVerified", "true");
        sessionStorage.setItem("phoneNumber", phone);

        alert("Login successful! Redirecting...");
        navigate("/Home");
  };
  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}mobileOTPVerification`,
        {
          headers: {
            phonenumber: phone,
          }
        }
      );
      
      if (response.data.status) {
        setVerificationSid(response.data.verificationSid);
        alert("OTP resent successfully!");
      } else {
        alert(response.data.message || "Failed to resend OTP!");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToPhoneStep = () => {
    setStep("phone");
    setOtp("");
    setVerificationSid("");
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
              <div className="flex">
                <span
                  className="flex items-center px-3 border border-r-0 border-[#C8A165] bg-[#FCFAF7]"
                  style={{ fontFamily: "Lato" }}
                >
                  +91
                </span>
                <input
                  className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                  style={{ background: "#FCFAF7", fontFamily: "Lato" }}
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>
            </div>
          )}

          {step === "otp" && (
            <>
              <div className="mb-4">
                <label
                  className="block mb-1 text-base font-normal"
                  style={{ color: "#222", fontFamily: "Lato", letterSpacing: "0.01em" }}
                  htmlFor="otp"
                >
                  Enter OTP sent to +91{phone}
                </label>
                <input
                  className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal tracking-widest text-center"
                  style={{ background: "#FCFAF7", fontFamily: "Lato", fontSize: "1.3rem" }}
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="- - - -"
                  required
                  maxLength={6}
                />
              </div>
              
              <div className="flex justify-between mb-4">
                <button
                  type="button"
                  onClick={goBackToPhoneStep}
                  className="bg-black text-white font-semibold px-4 py-2 w-1/2 mr-2 h-1/2"
                >
                  Change Phone No.
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading}
                  className="bg-black text-white font-semibold px-4 py-2 w-1/2 ml-2 h-1/2"
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (step === "phone" && phone.length !== 10) || (step === "otp" && otp.length < 4)}
            className="w-full py-3 mt-2 rounded font-bold transition-opacity"
            style={{
              background: primaryColor,
              color: "#fff",
              fontFamily,
              fontSize: "1.1rem",
              letterSpacing: "1px",
              opacity: loading || (step === "phone" && phone.length !== 10) || (step === "otp" && otp.length < 4) ? 0.5 : 1,
            }}
          >
            {loading ? "Please wait..." : step === "phone" ? "Send OTP" : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerOTPLogin;