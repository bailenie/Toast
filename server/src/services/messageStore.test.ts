import { describe, it, expect, beforeEach } from 'vitest';
import { messageStore, type ChatMessage } from './messageStore.js';

function createTestMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random()}`,
    circleId: 'circle-1',
    authorId: 'user-1',
    authorName: '测试用户',
    authorAvatar: 'moyu_otter',
    text: '测试消息',
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('MessageStore', () => {
  beforeEach(() => {
    messageStore.clear();
  });

  it('add(message) 存储消息成功', () => {
    const message = createTestMessage();
    messageStore.add(message);
    const messages = messageStore.getByCircle('circle-1');
    expect(messages).toHaveLength(1);
    expect(messages[0].id).toBe(message.id);
  });

  it('getByCircle(circleId) 返回该鱼圈所有未过期消息', () => {
    messageStore.add(createTestMessage({ circleId: 'circle-1' }));
    messageStore.add(createTestMessage({ circleId: 'circle-1' }));
    messageStore.add(createTestMessage({ circleId: 'circle-2' }));

    const messages = messageStore.getByCircle('circle-1');
    expect(messages).toHaveLength(2);
  });

  it('消息按createdAt升序排列', () => {
    const now = Date.now();
    messageStore.add(createTestMessage({ createdAt: now - 1000 }));
    messageStore.add(createTestMessage({ createdAt: now }));
    messageStore.add(createTestMessage({ createdAt: now - 500 }));

    const messages = messageStore.getByCircle('circle-1');
    expect(messages[0].createdAt).toBeLessThan(messages[1].createdAt);
    expect(messages[1].createdAt).toBeLessThan(messages[2].createdAt);
  });

  it('超过5分钟的消息不返回（惰性删除）', () => {
    const now = Date.now();
    messageStore.add(createTestMessage({ createdAt: now - 6 * 60 * 1000 })); // 6分钟前
    messageStore.add(createTestMessage({ createdAt: now })); // 现在

    const messages = messageStore.getByCircle('circle-1');
    expect(messages).toHaveLength(1);
  });

  it('不同鱼圈的消息互不影响', () => {
    messageStore.add(createTestMessage({ circleId: 'circle-1' }));
    messageStore.add(createTestMessage({ circleId: 'circle-2' }));

    const messages1 = messageStore.getByCircle('circle-1');
    const messages2 = messageStore.getByCircle('circle-2');
    expect(messages1).toHaveLength(1);
    expect(messages2).toHaveLength(1);
  });
});
