import React from "react";

const Footer = () => {
  return (
    <div className=" w-full h-[300px] flex items-center justify-between shadow-md border-y">
      {/* Left Side (Video Preview or Image) */}
      <div className="relative w-1/2 h-full bg-gray-200 overflow-hidden">
        <img
          src="src\assets\Pictures\Cyberpunk_ How to Master the Futuristic Style.gif" // Replace with your image URL
          alt="Preview"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side (Contact Info and Social Links) */}
      <div className="w-full flex flex-col items-center pl-6">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.52 3.48A11.903 11.903 0 0112 1.06 11.908 11.908 0 013.48 20.52l-1.42 4.44 4.44-1.42A11.903 11.903 0 0112 22.94a11.908 11.908 0 018.52-19.46zm-4.24 15.34a8.18 8.18 0 00-4.67-1.34A8.219 8.219 0 003.88 17a8.219 8.219 0 00-.28-11.6A8.214 8.214 0 0012 3.5a8.218 8.218 0 009.72 10.9c-1.82 1.82-4.28 3.28-7.06 3.28z" />
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
          {[
            "facebook",
            "instagram",
            "twitter"
          ].map((platform, index) => (
            <a
              key={index}
              href={`https://${platform}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
              aria-label={platform}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
