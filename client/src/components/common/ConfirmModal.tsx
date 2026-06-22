import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        className="bg-bg-card rounded-3xl p-6 cute-shadow-lg max-w-sm w-full mx-4 animate-page-fade"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <h2 className="font-display font-black text-lg text-ink mb-3 text-center">
          {title}
        </h2>

        {/* 确认文案 */}
        <p className="font-bold text-sm text-gray-500 text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* 按钮组 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white hover:bg-gray-50 text-ink border-2 border-ink rounded-xl font-display font-bold text-xs px-4 py-2 transition-all active:translate-y-0.5"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-xl font-display font-black text-xs px-4 py-2 transition-all active:translate-y-0.5"
          >
            确认
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
