export interface ChatMessage {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: number; // Unix timestamp (ms)
}

/**
 * 消息内存存储服务
 * 消息生命周期：5 分钟（300000ms）
 * 超过 5 分钟的消息在惰性读取时自动删除
 */
class MessageStore {
  private messages: Map<string, ChatMessage> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 分钟

  /**
   * 添加消息
   */
  add(message: ChatMessage): void {
    this.messages.set(message.id, message);
  }

  /**
   * 获取指定鱼圈的所有未过期消息
   * 按 createdAt 升序排列
   */
  getByCircle(circleId: string): ChatMessage[] {
    const now = Date.now();
    const result: ChatMessage[] = [];

    for (const [id, message] of this.messages) {
      if (message.circleId === circleId) {
        if (now - message.createdAt < this.TTL) {
          result.push(message);
        } else {
          // 惰性删除过期消息
          this.messages.delete(id);
        }
      }
    }

    // 按 createdAt 升序排列
    result.sort((a, b) => a.createdAt - b.createdAt);
    return result;
  }

  /**
   * 获取所有未过期消息（用于测试）
   */
  getAll(): ChatMessage[] {
    const now = Date.now();
    const result: ChatMessage[] = [];

    for (const [id, message] of this.messages) {
      if (now - message.createdAt < this.TTL) {
        result.push(message);
      } else {
        this.messages.delete(id);
      }
    }

    return result;
  }

  /**
   * 清空所有消息（用于测试）
   */
  clear(): void {
    this.messages.clear();
  }
}

// 单例导出
export const messageStore = new MessageStore();
