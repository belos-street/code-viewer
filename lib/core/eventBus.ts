// lib/core/eventBus.ts

interface HandlerMap {
  [eventName: string]: Array<(payload?: any) => void>;
}

class EventBus {
  private handlers: HandlerMap = {};

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on(eventName: string, handler: (payload?: any) => void): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  off(eventName: string, handler: (payload?: any) => void): void {
    const eventHandlers = this.handlers[eventName];
    if (eventHandlers) {
      this.handlers[eventName] = eventHandlers.filter((h) => h !== handler);
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param payload 事件负载
   */
  emit(eventName: string, payload?: any): void {
    const eventHandlers = this.handlers[eventName];
    if (eventHandlers) {
      eventHandlers.forEach((handler) => handler(payload));
    }
  }
}

export const eventBus = new EventBus();
