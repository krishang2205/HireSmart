import React from 'react';

// Social login button component
interface SocialButtonProps {
  provider: 'google' | 'apple' | 'facebook' | 'twitter';
  onClick?: () => void;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick, className = '' }) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          ),
          bgColor: 'bg-white',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          hoverColor: 'hover:bg-gray-50'
        };
      case 'apple':
        return {
          name: 'Apple',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          ),
          bgColor: 'bg-black',
          textColor: 'text-white',
          borderColor: 'border-black',
          hoverColor: 'hover:bg-gray-900'
        };
      case 'facebook':
        return {
          name: 'Facebook',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          ),
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          borderColor: 'border-blue-600',
          hoverColor: 'hover:bg-blue-700'
        };
      case 'twitter':
        return {
          name: 'Twitter',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          ),
          bgColor: 'bg-sky-500',
          textColor: 'text-white',
          borderColor: 'border-sky-500',
          hoverColor: 'hover:bg-sky-600'
        };
    }
  };

  const config = getProviderConfig();

  return (
    <button
      onClick={onClick}
  className={`flex items-center justify-center w-9 h-9 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.hoverColor} transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      aria-label={`Continue with ${config.name}`}
    >
      {config.icon}
    </button>
  );
};

// Social login section component
interface SocialLoginProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  onFacebookClick?: () => void;
  onTwitterClick?: () => void;
  className?: string;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleClick,
  onAppleClick,
  onFacebookClick,
  onTwitterClick,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="flex justify-center items-center gap-3">
        <SocialButton provider="google" onClick={onGoogleClick} />
        <SocialButton provider="apple" onClick={onAppleClick} />
        <SocialButton provider="facebook" onClick={onFacebookClick} />
        <SocialButton provider="twitter" onClick={onTwitterClick} />
      </div>
    </div>
  );
};

export default SocialLogin;
