import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuthContext } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import QuickPhrases from './QuickPhrases';
import CirclePanel from '../circle/CirclePanel';

interface ChatRoomProps {
  circleId: string;
  circleName: string;
}

export default function ChatRoom({ circleId, circleName }: ChatRoomProps) {
  const { messages, connected, sendMessage } = useChat(circleId);
  const { user } = useAuthContext();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const handleSend = async (text?: string) => {
    const content = text || inputText.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      sendMessage(content);
      setInputText('');
    } finally {
      setSending(false);
    }
  };

  // 按 Enter 发送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 顶部信息栏 */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b-2 border-ink bg-bg-page">
        <span className="font-display font-black text-lg text-ink">
          {circleName}
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-accent-bg text-ink font-bold text-xs px-2 py-1 rounded-lg">蛐蛐间</span>
          <span className="bg-red-100 text-red-600 font-bold text-xs px-2 py-1 rounded-lg">5MIN瞬时阅后即焚</span>
          <span className={`font-bold text-xs px-2 py-1 rounded-lg ${connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
            {connected ? '正在划水中' : '连接中...'}
          </span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4 select-none">🤫</div>
            <h3 className="font-display font-black text-xl text-ink mb-2">寂静无声的秘密基地</h3>
            <p className="font-bold text-sm text-gray-500">还没有消息，发条碎碎念开始蛐蛐吧</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={msg.authorId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 快捷常用语 + 输入区域 — 固定在底部 */}
      <div className="flex-shrink-0 border-t-2 border-ink bg-bg-page">
        <QuickPhrases onSend={handleSend} disabled={sending} />
        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                placeholder="打字蛐蛐同事领导...🤫 单条消息会在5分钟后物理火化销毁哦"
                className="w-full font-bold text-sm bg-white border-[3px] border-ink rounded-2xl px-4 py-3 resize-none focus:outline-none focus:border-accent"
                rows={2}
              />
              <span className={`absolute bottom-2 right-3 font-bold text-xs ${inputText.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                {inputText.length}/500
              </span>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || sending}
              className="bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-6 py-3 transition-all active:translate-y-0.5 shadow-sm disabled:opacity-50 self-end"
            >
              {sending ? '发送中...' : '碎碎念'}
            </button>
          </div>
        </div>
      </div>

      {/* 鱼圈管理侧边面板 */}
      <CirclePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
