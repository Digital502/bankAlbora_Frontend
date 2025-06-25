import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-32 h-32">
        {/* Círculo exterior */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-t-[#00FFD1] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Círculo medio */}
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-t-[#0ff] border-r-transparent border-b-transparent border-l-transparent animate-spin-reverse"></div>
        {/* Círculo interior */}
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full border-3 border-t-[#0fa] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Ícono banco SVG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_#00ffd1]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 stroke-[#00FFD1]"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 10l9-6 9 6"></path>
            <path d="M21 10v10H3V10"></path>
            <path d="M9 10v10"></path>
            <path d="M15 10v10"></path>
          </svg>
        </div>
      </div>
      <p className="mt-8 text-lg tracking-wide text-[#00FFD1] drop-shadow-[0_0_5px_#00ffd1]">
        Cargando...
      </p>

      <style>
        {`
          @keyframes spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};