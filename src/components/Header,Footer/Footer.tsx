import React from "react";
import promoVideo from '.../assets/Pictures/Cyberpunk_ How to Master the Futuristic Style.gif';

const Footer = () => {
  return (
    <>
      <style>
        {`
        @media (max-width: 900px) {
          .footer-root {
            flex-wrap: wrap !important;
            height: auto !important;
            min-height: 220px !important;
          }
          .footer-left {
            min-width: 180px !important;
            height: 140px !important;
          }
          .footer-right {
            padding-left: 1rem !important;
            padding-top: 1rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-root {
            flex-wrap: wrap !important;
            height: auto !important;
            min-height: 120px !important;
            padding: 0 !important;
          }
          .footer-left {
            min-width: 100px !important;
            height: 80px !important;
          }
          .footer-right h1 {
            font-size: 1rem !important;
          }
          .footer-right p {
            font-size: 0.8rem !important;
          }
          .footer-right .w-10, .footer-right .h-10 {
            width: 1.8rem !important;
            height: 1.8rem !important;
          }
        }
        `}
      </style>
      <div className="footer-root w-full h-[200px] flex items-center justify-between m-4 relative">
        {/* Left Side (Video Preview or Image) */}
        {/* <div className="footer-left relative w-1/2 h-full bg-gray-200 overflow-hidden">
          <img
            src="src\assets\Pictures\Cyberpunk_ How to Master the Futuristic Style.gif"
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div> */}

        {/* Right Side (Contact Info and Social Links) */}
        <div className="footer-right w-full flex flex-col items-center pl-6">
          {/* Business Name */}
          <h1 className="text-2xl text-black-900 font-['Avenir']">H C L O T H I N G</h1>
          <p className="text-gray-600 font-['Montserrat-Thin']">Times Square, New York, America</p>      
          {/* Social Media Icons */}
          <div className="flex flex-col items-center mt-4 space-y-1">
            {/* WhatsApp Text Link - darker WhatsApp gradient, no white tone */}
            <a
              href="https://wa.me/918976543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[1rem] font-['Avenir'] font-semibold uppercase"
              style={{
                background: "linear-gradient(90deg, #128c7e 0%, #25d366 60%, #075e54 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
                letterSpacing: "0.12em",
                padding: "0 0.25rem",
                opacity: 0.85
              }}
            >
              +91 9876543210
            </a>
            {/* Instagram Text Link - subtle gradient, lighter font weight */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[1rem] font-['Avenir'] font-semibold uppercase"
              style={{
                background: "linear-gradient(90deg, #f9ce34 0%, #ee2a7b 40%, #6228d7 70%, #2e2e92 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
                letterSpacing: "0.12em",
                padding: "0 0.25rem",
                opacity: 0.85
              }}
            >
              INSTAGRAM
            </a>
          </div>
          {/* Copyright bottom center and below icons */}
          <div className="w-full flex justify-center mt-2">
            <p className="text-[10px] text-gray-500 font-['Montserrat-Thin'] text-center m-0">
              COPYRIGHT © 2025 H C L O T H I N G.
              ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
        {/* Copyright absolutely bottom center for desktop */}
        <div
          className="w-full absolute left-1/2 bottom-2 -translate-x-1/2 flex justify-center"
          style={{ pointerEvents: "none" }}
        >
        </div>
      </div>
    </>
  );
};

export default Footer;
