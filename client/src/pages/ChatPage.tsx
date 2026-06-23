import { useActiveCircle } from '../contexts/ActiveCircleContext';
import { BottomTab } from '../components/common/BottomTab';
import ChatRoom from '../components/chat/ChatRoom';

export function ChatPage() {
  const { activeCircle, activeCircleId } = useActiveCircle();

  if (!activeCircleId) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 select-none">💬</div>
            <h2 className="font-display font-black text-xl text-ink mb-2">蛐蛐间</h2>
            <p className="font-bold text-sm text-gray-500">请先加入一个鱼圈</p>
          </div>
        </div>
        <BottomTab />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatRoom circleId={activeCircleId} circleName={activeCircle?.name || ''} />
      </div>
      <BottomTab />
    </div>
  );
}

export default ChatPage;
