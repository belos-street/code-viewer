<template>
  <div class="line-number-gutter">
    <div v-for="(line, index) in lines" :key="line.id || index" class="line-number">
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { PluginContext, CodeData } from '../core/types';

// 从 CodeViewer 组件注入插件上下文
const context = inject<PluginContext>('pluginContext');

if (!context) {
  throw new Error('LineNumberGutter must be used within a CodeViewer component with a valid pluginContext');
}

// 获取代码数据
const lines = computed<CodeData>(() => {
  return context.getCodeData ? context.getCodeData() : [];
});

</script>

<style scoped>
.line-number-gutter {
  text-align: right;
  color: #999;
  padding-right: 10px; /* 与代码内容保持一定间距 */
  white-space: pre; /* 确保行号与代码行对齐 */
  /* line-height: 1.5; */ /* 行高现在由 .line-number 控制或继承 */
}

.line-number {
  display: flex; /* 使用 flex 布局以便更好地控制对齐 */
  align-items: center; /* 垂直居中行号文本 */
  justify-content: flex-end; /* 使行号文本在容器内靠右对齐 */
  height: 1.5em; /* 设置与 CodeViewer.vue 中代码行期望一致的高度 (基于继承的font-size) */
  line-height: 1.5em; /* 确保行号文本在设置的高度内垂直居中 */
  /* font-size 应从 .code-viewer 继承, 以匹配代码行的字体大小 */
}
</style>