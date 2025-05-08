// lib/core/types.ts

/**
 * 代码行元数据接口
 */
export interface CodeLineMeta {
  // 预留字段，可以根据需要扩展，例如高亮、注释等
  [key: string]: any;
}

/**
 * 单行代码数据结构
 */
export interface CodeLine {
  id: string | number; // 每行的唯一标识
  content: string; // 代码内容
  meta?: CodeLineMeta; // 元数据
}

/**
 * CodeViewer 组件的数据属性类型
 */
export type CodeData = CodeLine[];

/**
 * 事件总线事件类型
 */
export interface EventPayload {
  eventName: string;
  data?: any;
}

/**
 * 插件上下文，包含核心API和事件总线实例
 */
export interface PluginContext {
  eventBus: {
    on: (eventName: string, handler: (payload?: any) => void) => void;
    off: (eventName: string, handler: (payload?: any) => void) => void;
    emit: (eventName: string, payload?: any) => void;
  };
  getCodeData: () => CodeData;
  // 可以根据需要添加更多核心API
  [key: string]: any; // 允许插件上下文扩展
}

/**
 * 插件接口定义
 */
export interface Plugin {
  name: string; // 插件名称，唯一标识
  install: (context: PluginContext) => void; // 安装插件
  uninstall: (context: PluginContext) => void; // 卸载插件
  // 插件可以有其他自定义方法和属性
  [key: string]: any;
}
