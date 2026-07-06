"use client";

import React from 'react';

interface LoaderProps {
  scale?: number;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ scale = 1, label }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative" 
        style={{ 
          transform: `scale(${scale})`, 
          height: scale === 1 ? '80px' : '40px', 
          width: '48px' 
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes jump-box {
            15% { border-bottom-right-radius: 3px; }
            25% { transform: translateY(9px) rotate(22.5deg); }
            50% {
              transform: translateY(18px) scale(1, .9) rotate(45deg);
              border-bottom-right-radius: 40px;
            }
            75% { transform: translateY(9px) rotate(67.5deg); }
            100% { transform: translateY(0) rotate(90deg); }
          }
          @keyframes shadow-pulse {
            0%, 100% { transform: scale(1, 1); }
            50% { transform: scale(1.2, 1); }
          }
          .uiverse-loader-box {
            width: 48px;
            height: 48px;
            position: relative;
          }
          .uiverse-loader-box::before {
            content: '';
            width: 48px;
            height: 5px;
            background: rgba(79, 70, 229, 0.2);
            position: absolute;
            top: 60px;
            left: 0;
            border-radius: 50%;
            animation: shadow-pulse 0.5s linear infinite;
          }
          .uiverse-loader-box::after {
            content: '';
            width: 100%;
            height: 100%;
            background: #4f46e5;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 4px;
            animation: jump-box 0.5s linear infinite;
          }
        `}} />
        <div className="uiverse-loader-box"></div>
      </div>
      
      {label && (
        <p className="mt-12 text-indigo-600 font-black animate-pulse tracking-widest text-[10px] uppercase">
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;