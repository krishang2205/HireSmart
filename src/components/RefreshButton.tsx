import React from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  title?: string;
  className?: string;
  size?: number; // diameter in px
}

// A minimal circular refresh button replicating the provided HTML/CSS design.
// Uses utility classes; falls back to inline sizing for custom size.
export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  loading = false,
  title = 'Refresh',
  className = '',
  size = 60
}) => {
  const diameterStyle: React.CSSProperties = { width: size, height: size };
  return (
    <button
      type="button"
      onClick={!loading ? onClick : undefined}
      aria-label={title}
      aria-busy={loading}
      title={title}
      disabled={loading}
      style={diameterStyle}
      className={[
        'relative group rounded-full border-2 border-black flex items-center justify-center bg-transparent',
        'transition-transform duration-300 ease-out select-none',
        'disabled:cursor-not-allowed',
        !loading && 'hover:rotate-90',
        loading && 'opacity-70',
        className
      ].filter(Boolean).join(' ')}
    >
      {/* Arrow shape constructed with borders like the reference image */}
      <span
        className={[
          'block absolute',
          'w-[20px] h-[20px] border-2 border-black border-t-0 border-l-0',
          'rotate-45',
          // Positioning relative to 60px container (approx top/right 18px). We compute via inline if size changes.
        ].join(' ')}
        style={{
          top: size * 0.3, // ~18px when size=60
          right: size * 0.3
        }}
      />
      {/* Loading indicator overlays subtle spinner around the circle */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center animate-spin" aria-hidden="true">
          <svg className="w-[55%] h-[55%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9" />
          </svg>
        </span>
      )}
    </button>
  );
};

export default RefreshButton;
