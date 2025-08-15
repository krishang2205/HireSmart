import React, { InputHTMLAttributes, useId, forwardRef } from 'react';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  dense?: boolean; // compact vertical padding
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className = '', error, type = 'text', dense = false, ...rest }, ref) => {
    const id = useId();
    const pad = dense ? 'px-3 pt-4 pb-1.5 text-[13px]' : 'px-4 pt-5 pb-2 text-sm';
    const labelPos = dense
      ? // raised the floated label slightly for more gap
        'left-3 top-0.5 text-[11px] peer-placeholder-shown:top-3 peer-placeholder-shown:text-[13px] peer-focus:top-0.5 peer-focus:text-[11px]'
      : // raised the floated label slightly for more gap
        'left-4 top-1.5 text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-focus:top-1.5 peer-focus:text-xs';

    return (
      <div className="relative group">
        <input
          id={id}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className={`peer w-full rounded-xl border bg-white/60 backdrop-blur placeholder-transparent ${pad} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition ${error ? 'border-red-400 focus:ring-red-500/50' : 'border-slate-300/70 hover:border-slate-400'} ${className}`}
          placeholder=" " // prevents double text while keeping animation
          {...rest}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute ${labelPos} tracking-wide font-medium transition-all select-none 
            text-slate-500 peer-placeholder-shown:text-slate-500/70 peer-focus:text-blue-600 ${error ? 'text-red-500 peer-focus:text-red-500' : ''}`}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingLabelInput.displayName = 'FloatingLabelInput';

interface PasswordFieldProps extends Omit<FloatingLabelInputProps, 'type'> {
  strength?: number; // 0-4
  showStrength?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ strength, showStrength, dense, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
      <div className={dense ? 'space-y-1' : 'space-y-1.5'}>
        <div className="relative">
          <FloatingLabelInput {...props} ref={ref} dense={dense} type={visible ? 'text' : 'password'} className="pr-12" />
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
            className={`absolute right-3 ${dense ? 'top-2.5' : 'top-3'} text-[11px] font-medium text-slate-500 hover:text-slate-700 focus:outline-none`}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
        {showStrength && typeof strength === 'number' && strength >= 0 && (
          <div className={dense ? 'space-y-0.5' : 'space-y-1'}>
            <div className={`w-full rounded bg-slate-200 overflow-hidden ${dense ? 'h-1' : 'h-1.5'}`}>
              <div
                className={`h-full transition-all duration-500 ${colors[strength]}`}
                style={{ width: `${(strength + 1) * 20}%` }}
              />
            </div>
            <p className="text-[10.5px] text-slate-500">
              Strength:{' '}
              <span className="font-medium text-slate-700">
                {['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }
);
PasswordField.displayName = 'PasswordField';

// Custom Select component with proper react-hook-form integration
interface FloatingLabelSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  dense?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FloatingLabelSelect = forwardRef<HTMLSelectElement, FloatingLabelSelectProps>(
  ({ label, className = '', error, dense = false, options, placeholder = 'Select an option', ...rest }, ref) => {
    const id = useId();
    const pad = dense ? 'px-3 pt-4 pb-1.5 text-[13px]' : 'px-4 pt-5 pb-2 text-sm';
    const labelPos = dense
      ? 'left-3 top-0.5 text-[11px] peer-placeholder-shown:top-3 peer-placeholder-shown:text-[13px] peer-focus:top-0.5 peer-focus:text-[11px]'
      : 'left-4 top-1.5 text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-focus:top-1.5 peer-focus:text-xs';

    return (
      <div className="relative group">
        <select
          id={id}
          ref={ref}
          aria-invalid={!!error}
          className={`peer w-full rounded-xl border bg-white/60 backdrop-blur ${pad} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition appearance-none ${error ? 'border-red-400 focus:ring-red-500/50' : 'border-slate-300/70 hover:border-slate-400'} ${className}`}
          defaultValue=""
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <label
          htmlFor={id}
          className={`pointer-events-none absolute ${labelPos} tracking-wide font-medium transition-all select-none 
            text-slate-500 peer-focus:text-blue-600 ${error ? 'text-red-500 peer-focus:text-red-500' : ''}`}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingLabelSelect.displayName = 'FloatingLabelSelect';
