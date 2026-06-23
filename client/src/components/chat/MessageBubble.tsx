import { AVATARS } from '../../avatars';
import CountdownTimer from './CountdownTimer';
import type { ChatMessage } from '../../hooks/useChat';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const avatarEmoji = AVATARS.find((a) => a.id === message.authorAvatar)?.emoji ?? '🦦';

  return (
    <div className={`flex gap-2 mb-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 头像 */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-accent-bg rounded-xl border-2 border-ink flex items-center justify-center text-xl select-none">
          {avatarEmoji}
        </div>
      </div>

      {/* 消息内容 */}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* 昵称和倒计时 */}
        <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-bold text-xs text-ink">{message.authorName}</span>
          <CountdownTimer createdAt={message.createdAt} />
        </div>

        {/* 气泡 */}
        <div
          className={`
            p-3 rounded-2xl border-2 border-ink
            ${isMe
              ? 'bg-accent-bg rounded-tr-sm'
              : 'bg-white rounded-tl-sm'
            }
          `}
        >
          <p className="font-bold text-sm text-ink whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}
