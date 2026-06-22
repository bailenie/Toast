import { useState, useEffect } from 'react';
import api from '../utils/api';

/** 预设兜底语录（8条） */
const DEFAULT_QUOTES: string[] = [
  '上班太无聊？来吐司，和千万打工人一起带薪划水',
  '一个让老板以为你在工作的秘密基地',
  '把键盘砸了不如来这骂两句',
  '摸鱼是一种艺术，而我是艺术家',
  '今天也是努力摸鱼的一天',
  '打工魂，人上人',
  '咖啡续命中...',
  '工资是摸鱼的动力',
];

export interface MemeQuote {
  id: number;
  text: string;
  speed: number;   // 8-15秒
  track: number;   // 0-4，5个垂直轨道
  delay: number;   // 动画延迟
}

/** 轨道基准速度（每条轨道速度相同，避免同轨道弹幕追尾重叠） */
const TRACK_SPEEDS = [10, 12, 11, 13, 9];

/** 将原始语录分配轨道、速度、延迟 */
function assignDanmakuProps(quotes: string[]): MemeQuote[] {
  return quotes.map((text, index) => {
    const track = index % 5;
    return {
      id: index,
      text,
      speed: TRACK_SPEEDS[track],
      track,
      // 同轨道弹幕错开：按轨道内序号分配递增延迟
      delay: Math.floor(index / 5) * 4,
    };
  });
}

export function useMemeQuotes() {
  const [quotes, setQuotes] = useState<MemeQuote[]>(() =>
    assignDanmakuProps(DEFAULT_QUOTES),
  );

  useEffect(() => {
    let cancelled = false;

    api.get('/home/meme-quotes')
      .then((res: { data: { success: boolean; data: { quotes: string[] } } }) => {
        if (cancelled) return;
        const serverQuotes = res.data?.data?.quotes;
        if (serverQuotes && serverQuotes.length > 0) {
          setQuotes(assignDanmakuProps(serverQuotes));
        }
      })
      .catch(() => {
        // 接口失败时保持默认数据，无需处理
      });

    return () => { cancelled = true; };
  }, []);

  return quotes;
}
