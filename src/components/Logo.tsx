'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ 
  width = 48, 
  height = 48, 
  className = '',
  showText = false 
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR
    return (
      <div className={`flex items-center ${className}`}>
        <div 
          className="bg-muted rounded"
          style={{ width, height }}
        />
        {showText && (
          <span className="font-bold text-xl ml-2">KursPlatform</span>
        )}
      </div>
    );
  }

  // Determine which logo to use based on theme
  const isDark = resolvedTheme === 'dark';
  const logoSrc = isDark 
    ? '/img/logo/logo (2).png'  // Dark theme logo
    : '/img/logo/logo (1).png'; // Light theme logo

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="KursPlatform Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span className="font-bold text-xl ml-2">KursPlatform</span>
      )}
    </div>
  );
}
