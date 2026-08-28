import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-md focus:outline-none cursor-pointer';
  
  const variants = {
    primary: 'bg-[#0A192F] text-white hover:bg-[#1E3A8A] border border-transparent shadow-sm',
    saffron: 'bg-gradient-to-r from-[#FF9933] to-[#D97706] text-white hover:opacity-95 shadow-sm',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    outline: 'bg-transparent text-[#0A192F] border border-[#0A192F] hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
