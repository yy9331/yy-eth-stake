import { useState, useEffect, useCallback } from 'react';

interface UseMobileOptimizationReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  touchSupported: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

export const useMobileOptimization = (): UseMobileOptimizationReturn => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [touchSupported, setTouchSupported] = useState(false);

  // 检测设备类型和屏幕尺寸
  const detectDevice = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 检测触摸支持
    setTouchSupported('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // 检测屏幕尺寸
    if (width < 640) {
      setScreenSize('xs');
      setIsMobile(true);
      setIsTablet(false);
      setIsDesktop(false);
    } else if (width < 768) {
      setScreenSize('sm');
      setIsMobile(true);
      setIsTablet(false);
      setIsDesktop(false);
    } else if (width < 1024) {
      setScreenSize('md');
      setIsMobile(false);
      setIsTablet(true);
      setIsDesktop(false);
    } else if (width < 1280) {
      setScreenSize('lg');
      setIsMobile(false);
      setIsTablet(false);
      setIsDesktop(true);
    } else if (width < 1536) {
      setScreenSize('xl');
      setIsMobile(false);
      setIsTablet(false);
      setIsDesktop(true);
    } else {
      setScreenSize('2xl');
      setIsMobile(false);
      setIsTablet(false);
      setIsDesktop(true);
    }
    
    // 检测方向
    setOrientation(width > height ? 'landscape' : 'portrait');
  }, []);

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 触摸开始时的处理逻辑
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // 触摸移动时的处理逻辑
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // 触摸结束时的处理逻辑
    e.preventDefault();
  }, []);

  useEffect(() => {
    // 初始化检测
    detectDevice();
    
    // 监听窗口大小变化
    const handleResize = () => {
      detectDevice();
    };
    
    // 监听方向变化
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectDevice]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
    touchSupported,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
