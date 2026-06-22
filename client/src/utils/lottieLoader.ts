import { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';

interface UseLottieOptions {
  /** Lottie JSON 文件路径 */
  src: string;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
}

/**
 * Lottie 动画懒加载 Hook
 * 只在组件挂载时才加载动画文件
 */
export function useLottie({ src, autoplay = true, loop = true }: UseLottieOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let animation: AnimationItem | null = null;
    let cancelled = false;

    async function loadAnimation() {
      try {
        const lottie = await import('lottie-web');
        if (cancelled || !containerRef.current) return;

        animation = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          path: src,
        });

        animation.addEventListener('DOMLoaded', () => {
          if (!cancelled) setLoading(false);
        });

        animation.addEventListener('data_failed', () => {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
        });
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadAnimation();

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [src, autoplay, loop]);

  return { containerRef, loading, error };
}
