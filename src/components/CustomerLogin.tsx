import React, { FormEvent, useState } from "react";
import "../App.css";
import Header from "./Header,Footer/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const primaryColor = "#7B3F14";
const accentColor = "#C8A165";
const fontFamily = "Playfair-display, sans-serif";

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call getUser API with email and password as payload
      const userRes = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}getUser`,
        {
          email: loginData.email,
          password: loginData.password,
        }
      );
      if (userRes.data && userRes.data.user) {
        sessionStorage.setItem("user", JSON.stringify(userRes.data.user));
        // Store user id separately
        sessionStorage.setItem("userId", userRes.data.user._id || userRes.data.user.id);
        sessionStorage.setItem("cartId", userRes.data.user.cartId || "");
        navigate('/Home');
        alert('Login successful! Redirecting to home page...');
      } else {
        alert(userRes.data?.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      alert(
       "User Not Found"
      );
    }
  };

    const addUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser = {
      name: signupData.name,
      username: signupData.email,
      email: signupData.email,
      password: signupData.password,
      phone: signupData.phone,
      cartId: sessionStorage.getItem("cartId") || "",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}addUser`,
        newUser
      );
      if (response.data.status === true) {
        const loginres = await axios.post(`${import.meta.env.VITE_REACT_API_URL}getUser`, {
          email: newUser.email,
          password: newUser.password,
        });
        if (loginres.data && loginres.data.user) {
          sessionStorage.setItem("user", JSON.stringify(loginres.data.user));
          sessionStorage.setItem("userId", loginres.data.user._id || loginres.data.user.id);
          
          navigate('/Home');
          alert('Signup successful! Redirecting to home page...');
        }
      }
      else {
        alert('Signup failed. Please check your details and try again.');
      }
    }
    catch (error) {
      console.error("Error during signup:", error);
      alert('An error occurred during signup. Please try again later.');
    }
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7]"
      style={{ fontFamily }}
    >
      <style>
        {`
        @media (max-width: 600px) {
          .customer-login-card {
            max-width: 95vw !important;
            padding: 1.25rem !important;
          }
          .customer-login-card h1 {
            font-size: 1.3rem !important;
            margin-bottom: 1rem !important;
          }
          .customer-login-card label {
            font-size: 0.95rem !important;
          }
          .customer-login-card input {
            font-size: 0.95rem !important;
            padding: 0.65rem !important;
          }
          .customer-login-card button[type="submit"] {
            font-size: 1.1rem !important;
            padding: 0.7rem !important;
            background: #7B3F14 !important;
            color: #fff !important;
            font-family: Playfair-display, sans-serif !important;
            font-weight: bold !important;
            border-radius: 0.25rem !important;
            letter-spacing: 1px !important;
            margin-top: 0.5rem !important;
          }
          .customer-login-card .mt-6 {
            margin-top: 1rem !important;
          }
          .customer-login-card .text-xs {
            font-size: 0.8rem !important;
          }
        }
        @media (max-width: 400px) {
          .customer-login-card {
            padding: 0.5rem !important;
          }
          .customer-login-card h1 {
            font-size: 1.1rem !important;
          }
          .customer-login-card label {
            font-size: 0.85rem !important;
          }
          .customer-login-card input {
            font-size: 0.85rem !important;
            padding: 0.5rem !important;
          }
          .customer-login-card button[type="submit"] {
            font-size: 1rem !important;
            padding: 0.5rem !important;
            background: #7B3F14 !important;
            color: #fff !important;
            font-family: Playfair-display, sans-serif !important;
            font-weight: bold !important;
            border-radius: 0.25rem !important;
            letter-spacing: 1px !important;
            margin-top: 0.5rem !important;
          }
        }
        `}
      </style>
      <Header />
      <div
        className="customer-login-card w-full max-w-md p-8 rounded shadow mt-8"
        style={{
          background: "#fff",
          border: `1px solid ${accentColor}`,
        }}
      >
        <form onSubmit={isSignup ?(e)=>addUser(e) : handleLogin}>
          {isSignup && (
            <>
              <div className="mb-4">
                <label
                  className="block mb-1 text-base font-normal"
                  style={{
                    color: "#222",
                    fontFamily: "Lato",
                    letterSpacing: "0.01em",
                  }}
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                  style={{ background: "#FCFAF7", fontFamily: "Lato" }}
                  type="text"
                  id="name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-1 text-base font-normal"
                  style={{
                    color: "#222",
                    fontFamily: "Lato",
                    letterSpacing: "0.01em",
                  }}
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
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  required
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label
              className="block mb-1 text-base font-normal"
              style={{
                color: "#222",
                fontFamily: "Lato",
                letterSpacing: "0.01em",
              }}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
              style={{ background: "#FCFAF7", fontFamily: "Lato" }}
              type="email"
              id="email"
              name="email"
              value={isSignup ? signupData.email : loginData.email}
              onChange={isSignup ? handleSignupChange : handleLoginChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-1 text-base font-normal"
              style={{
                color: "#222",
                fontFamily: "Lato",
                letterSpacing: "0.01em",
              }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
              style={{ background: "#FCFAF7", fontFamily: "Lato" }}
              type="password"
              id="password"
              name="password"
              value={isSignup ? signupData.password : loginData.password}
              onChange={isSignup ? handleSignupChange : handleLoginChange}
              required
            />
          </div>
          {isSignup && (
            <div className="mb-4">
              <label
                className="block mb-1 text-base font-normal"
                style={{
                  color: "#222",
                  fontFamily: "Lato",
                  letterSpacing: "0.01em",
                }}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                style={{ background: "#FCFAF7", fontFamily: "Lato" }}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded font-bold"
            style={{
              background: primaryColor,
              color: "#fff",
              fontFamily,
              fontSize: "1.1rem",
              letterSpacing: "1px",
            }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 mb-2" style={{ fontFamily }}>
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}
          </div>
          <button
            className="bg-black text-white font-semibold"
            style={{ fontFamily }}
            onClick={() => setIsSignup((prev) => !prev)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
