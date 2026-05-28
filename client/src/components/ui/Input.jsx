import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
  id, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 ${
          error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 font-medium">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
