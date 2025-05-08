// lib/plugin/lineNumber.ts
import type { Plugin, PluginContext } from "../core/types";
import LineNumberGutter from "./LineNumberGutter.vue"; // 我们将很快创建这个组件

export const lineNumberPlugin: Plugin = {
  name: "lineNumber",
  install: (context: PluginContext) => {
    // 注册一个Gutter组件用于显示行号
    context.registerGutterComponent("lineNumberGutter", LineNumberGutter);
    console.log("LineNumber plugin installed, gutter component registered.");
  },
  uninstall: (context: PluginContext) => {
    // 卸载时注销Gutter组件
    context.unregisterGutterComponent("lineNumberGutter");
    console.log(
      "LineNumber plugin uninstalled, gutter component unregistered."
    );
  },
};
