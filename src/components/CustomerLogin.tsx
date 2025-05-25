import React, { useState } from "react";
import "../App.css";
import Header from "./Header,Footer/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const primaryColor = "#7B3F14";
const accentColor = "#C8A165";
const fontFamily = "Montserrat, sans-serif";

const CustomerLogin: React.FC = () => {
        const navigate = useNavigate()

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    alert("Login submitted!");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // await axios.post(`${import.meta.env.VITE_REACT_API_URL}UserRegister`,{
    // name: "",
    // email: "",
    // phone: "",
    // password: ""}) 
    //     .then(res=>{
    //         if(res.data.status === true){
    //             navigate('/Home')
    //             alert('Signup successful! Redirecting to home page...')
    //         }
    //         else{
    //             alert('wrong username or password')
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //         alert('An error occurred during signup. Please try again later.')
    //     })
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7]"
      style={{ fontFamily }}
    >
      <Header />
      <div
        className="w-full max-w-md p-8 rounded shadow mt-8"
        style={{
          background: "#fff",
          border: `1px solid ${accentColor}`,
        }}
      >
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{
            color: primaryColor,
            fontFamily,
            letterSpacing: isSignup ? "0.05em" : "normal",
            fontWeight: isSignup ? 700 : 700,
          }}
        >
          {isSignup ? "Sign Up" : ""}
        </h1>
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <>
              <div className="mb-4">
                <label
                  className="block mb-1 text-base font-normal"
                  style={{
                    color: "#222",
                    fontFamily: "Montserrat-Thin",
                    letterSpacing: "0.01em",
                  }}
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                  style={{ background: "#FCFAF7", fontFamily: "Montserrat-Thin" }}
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
                    fontFamily: "Montserrat-Thin",
                    letterSpacing: "0.01em",
                  }}
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                  style={{ background: "#FCFAF7", fontFamily: "Montserrat-Thin" }}
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
                fontFamily: "Montserrat-Thin",
                letterSpacing: "0.01em",
              }}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
              style={{ background: "#FCFAF7", fontFamily: "Montserrat-Thin" }}
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
                fontFamily: "Montserrat-Thin",
                letterSpacing: "0.01em",
              }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
              style={{ background: "#FCFAF7", fontFamily: "Montserrat-Thin" }}
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
                  fontFamily: "Montserrat-Thin",
                  letterSpacing: "0.01em",
                }}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none font-normal"
                style={{ background: "#FCFAF7", fontFamily: "Montserrat-Thin" }}
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
            className="bg-black text-white underline font-semibold"
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
