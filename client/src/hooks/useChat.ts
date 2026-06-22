import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../utils/token';

export interface ChatMessage {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: number;
}

export function useChat(circleId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // 连接 Socket.io
  useEffect(() => {
    if (!circleId) return;

    const token = getToken();
    if (!token) return;

    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_circle', { circleId });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('history_messages', (data: { messages: ChatMessage[] }) => {
      setMessages(data.messages);
    });

    socket.on('new_message', (data: { message: ChatMessage }) => {
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [circleId]);

  // 发送消息
  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current || !circleId) return;

    socketRef.current.emit('send_message', {
      circleId,
      text,
    });
  }, [circleId]);

  // 过滤过期消息（客户端侧）
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages((prev) =>
        prev.filter((msg) => now - msg.createdAt < 5 * 60 * 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    messages,
    connected,
    sendMessage,
  };
}
