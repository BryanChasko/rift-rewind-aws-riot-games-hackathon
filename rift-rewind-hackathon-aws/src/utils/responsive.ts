import React from 'react';

// Cloudscape responsive utilities
export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  
  React.useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);
  
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

export const getResponsiveColumns = (mobile: number, tablet: number, desktop: number) => {
  const { isMobile, isTablet } = useResponsive();
  if (isMobile) return mobile;
  if (isTablet) return tablet;
  return desktop;
};

// Bidirectional utilities
export const isRTL = () => document.documentElement.dir === 'rtl';

export const getDirectionalIcon = (ltrIcon: string, rtlIcon?: string) => {
  return isRTL() ? (rtlIcon || ltrIcon) : ltrIcon;
};