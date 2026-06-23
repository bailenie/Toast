import { useState, useCallback, useRef, useEffect } from 'react';

export function useFullscreenScroll(sectionCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 监听滚动更新活跃索引
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(scrollTop / height);
      setActiveIndex(Math.min(index, sectionCount - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sectionCount]);

  // 滚动到指定板块
  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const height = container.clientHeight;
    container.scrollTo({ top: height * index, behavior: 'smooth' });
  }, []);

  // 回到顶部
  const scrollToTop = useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

  return { activeIndex, containerRef, scrollTo, scrollToTop };
}
