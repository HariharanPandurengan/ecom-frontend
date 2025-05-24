import React from "react";

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
      <div className="footer-root w-full h-[300px] flex items-center justify-between shadow-md border-y">
        {/* Left Side (Video Preview or Image) */}
        <div className="footer-left relative w-1/2 h-full bg-gray-200 overflow-hidden">
          <img
            src="src\assets\Pictures\Cyberpunk_ How to Master the Futuristic Style.gif"
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side (Contact Info and Social Links) */}
        <div className="footer-right w-full flex flex-col items-center pl-6">
          {/* Business Name */}
          <h1 className="text-2xl text-black-900 font-['Avenir']">H C L O T H I N G</h1>
          <p className="text-gray-600 font-['Montserrat-Thin']">Times Square, New York, America</p>

          {/* Contact Information */}
          <div className="flex items-center mt-4 space-x-4">
            <a
              href="https://wa.me/918976543210"
              className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full"
              aria-label="WhatsApp"
            >
              {/* WhatsApp SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.74 6.41l-1.84 6.73a1.07 1.07 0 0 0 1.31 1.31l6.73-1.84a12.75 12.75 0 0 0 6.41 1.74c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8zm0 23.04c-2.01 0-3.99-.53-5.71-1.53a1.07 1.07 0 0 0-.74-.11l-5.13 1.4 1.4-5.13a1.07 1.07 0 0 0-.11-.74A10.65 10.65 0 0 1 5.36 16c0-5.89 4.78-10.67 10.64-10.67 5.89 0 10.67 4.78 10.67 10.67 0 5.86-4.78 10.64-10.67 10.64zm5.36-7.47c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.02 1-.99 2.43.03 1.43 1.04 2.81 1.19 3.01.15.19 2.04 3.12 5.01 4.25.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z"/>
              </svg>
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center font-['Avenir-Thin']  text-l font-semibold"
            >
              +91 9876543210
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex mt-4 space-x-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
              aria-label="facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
              aria-label="instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.334 3.678 1.315c-.981.981-1.187 2.093-1.245 3.374C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.612.058 1.281.264 2.393 1.245 3.374.981.981 2.093 1.187 3.374 1.245C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.264 3.374-1.245.981-.981 1.187-2.093 1.245-3.374.058-1.28.07-1.689.07-7.612 0-5.923-.012-6.332-.07-7.612-.058-1.281-.264-2.393-1.245-3.374-.981-.981-2.093-1.187-3.374-1.245C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
              aria-label="twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
