import React, { useState } from "react";
import promoVideo from '.../assets/Pictures/Cyberpunk_ How to Master the Futuristic Style.gif';
import { FiChevronDown } from 'react-icons/fi';

const Footer = () => {
  const [showStory, setShowStory] = useState(false);

  return (
    <>
      <style>
        {`
        .footer-root {
          display: flex;
          flex-wrap: nowrap;
          min-height: 200px;
        }

        @media (max-width: 900px) {
          .footer-root {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1rem 1.5rem !important;
            min-height: auto !important;
          }
          .footer-left, .footer-right {
            width: 100% !important;
            padding: 0.5rem 0 !important;
          }
          .footer-left p {
            font-size: 0.85rem !important;
          }
        }

        @media (max-width: 600px) {
          .footer-left p {
            font-size: 0.75rem !important;
          }
          .footer-right h1 {
            font-size: 1.25rem !important;
          }
        }
        `}
      </style>

      <div className="footer-root w-full h-auto items-start justify-between m-4 relative px-8">
        {/* Left Side (Brand Description with dropdown) */}
        <div className="footer-left w-1/2 flex flex-col justify-start">
          <div className="flex justify-between items-center mb-2 cursor-pointer px-4 py-1 bg-gray-50 hover:bg-gray-200 transition-colors duration-200" onClick={() => setShowStory(!showStory)}>
            <h2 className="text-2xl font-semibold text-gray-800 font-['Didot']">Brand Story</h2>
                <FiChevronDown
      className={`text-xl text-gray-600 transition-transform duration-300 ${
        showStory ? 'rotate-180' : 'rotate-0'
      }`}
    />
          </div>

          {showStory && (
            <p className="text-xs text-gray-600 font-['Montserrat-Thin'] leading-relaxed max-w-[420px] transition-opacity duration-300 ease-in-out">
              In a world overflowing with options, men's fashion has become cluttered. Too many patterns. Too many silhouettes.<br/>
              Too little thought. At The Nirah, we believe beauty lies in simplicity — and that essentials <br/>
              make or break a man’s style. Our name comes from the Tamil word “Niram” — meaning colour. Crafted to <br/>
              simplify a man’s wardrobe, not complicate it. <br/>
              <br/>
              We’re from Erode, a town known for its textile legacy — and we carry that quiet heritage forward in <br/>
              everything we do. We build timeless menswear for those coming into their own. A man who’s <br/>
              discovering that style isn’t about standing out, but standing sure. <br/>
              <br/>
              Every Nirah piece is essential. Every silhouette, thoughtful. Every product is made in India.<br/>
            </p>
          )}
        </div>

        {/* Right Side (Contact Info and Social Links) */}
        <div className="footer-right w-1/2 flex flex-col items-center pl-6">
          <h1 className="text-2xl text-black-900 font-['Didot']">T H E &nbsp;&nbsp; N I R A H</h1>
          <div className="flex flex-col items-center space-y-1 mt-2">
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
          <div className="w-full flex justify-center mt-3">
            <p className="text-[10px] text-gray-500 font-['Montserrat-Thin'] text-center m-0">
              COPYRIGHT © 2025 NIRAH. ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;