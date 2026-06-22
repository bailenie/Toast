interface QuickPhrasesProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const PHRASES = [
  { icon: '🚨', text: '老板刚才朝这边看了一眼，全员静默！👀' },
  { icon: '🏃', text: '溜去带薪如厕，预计加钟10分钟 🚽' },
  { icon: '☕', text: '有人去茶水间接水吗？帮代杯冰水 🧊' },
  { icon: '🐷', text: '今天又是努力当窝囊废、赚取窝囊费的一天 💰' },
  { icon: '💀', text: '救命，现在的Bug越改越多，准备反锅！🤬' },
  { icon: '🎉', text: '周五快来！我已经开始过周末脑循环了 🥴' },
];

export default function QuickPhrases({ onSend, disabled }: QuickPhrasesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-hide">
      {PHRASES.map((phrase) => (
        <button
          key={phrase.text}
          onClick={() => onSend(phrase.text)}
          disabled={disabled}
          className="flex-shrink-0 bg-white hover:bg-accent-bg border-2 border-ink rounded-xl font-bold text-xs px-3 py-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <span className="mr-1">{phrase.icon}</span>
          {phrase.text.slice(0, 8)}...
        </button>
      ))}
    </div>
  );
}
