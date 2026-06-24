import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function TimeSelect({ value, onChange, label }: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hours, setHours] = useState(() => {
    const h = parseInt(value.split(':')[0], 10);
    return isNaN(h) ? 9 : h;
  });
  const [minutes, setMinutes] = useState(() => {
    const m = parseInt(value.split(':')[1], 10);
    return isNaN(m) ? 0 : m;
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectHour = (h: number) => {
    setHours(h);
    onChange(`${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const handleSelectMinute = (m: number) => {
    setMinutes(m);
    onChange(`${String(hours).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const displayValue = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="font-bold text-sm text-gray-600 block mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-bold text-sm bg-bg-page border-[3px] border-ink rounded-xl px-4 py-3 focus:outline-none focus:border-accent cursor-pointer text-left"
      >
        <span>{displayValue}</span>
        <Clock size={18} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border-[3px] border-ink rounded-xl shadow-lg p-2 w-full max-h-48 overflow-y-auto">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-xs font-bold text-gray-500 mb-1 text-center">时</div>
              <div className="grid grid-cols-4 gap-1">
                {hoursList.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleSelectHour(h)}
                    className={`p-1.5 rounded-lg text-sm font-bold transition-colors ${
                      hours === h
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-ink'
                    }`}
                  >
                    {String(h).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-gray-500 mb-1 text-center">分</div>
              <div className="grid grid-cols-4 gap-1">
                {minutesList.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMinute(m)}
                    className={`p-1.5 rounded-lg text-sm font-bold transition-colors ${
                      minutes === m
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-ink'
                    }`}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
