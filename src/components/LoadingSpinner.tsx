'use client'; // <-- must be the very first line (no spaces/comments above)

import React from 'react';

type Props = { size?: number };

export default function SpinnerClient({ size = 32 }: Props) {
  const s = Math.max(16, size);

  // Pure inline styles + SVG; no styled-jsx anywhere
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg width={s} height={s} viewBox="0 0 50 50" aria-hidden="true">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray="90"
          strokeDashoffset="60"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
