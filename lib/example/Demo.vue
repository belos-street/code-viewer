<template>
  <div class="demo-container">
    <h1>Code Viewer Demo</h1>
    <div class="controls">
      <button @click="toggleLineNumberPlugin">{{ isLineNumberPluginActive ? 'Uninstall' : 'Install' }} LineNumber Plugin</button>
      <button @click="changeCode">Change Code</button>
    </div>
    <CodeViewer :code="currentCodeData" :plugins="activePlugins" ref="codeViewerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CodeViewer from '../core/CodeViewer.vue';
import type { CodeData, Plugin } from '../core/types';
import { lineNumberPlugin } from '../plugin/lineNumber'; // 导入行号插件

const codeViewerRef = ref<InstanceType<typeof CodeViewer> | null>(null);

const mockCode: CodeData = [];
for (let i = 0; i < 200; i++) {
  mockCode.push({ id: `line${i + 1}`, content: `// This is line number ${i + 1} of the mock code.` });
}

const initialCode: CodeData = [
  { id: 'line1', content: 'const greet = (name: string) => {' },
  { id: 'line2', content: '  console.log(`Hello, ${name}!`);' },
  { id: 'line3', content: '};' },
  { id: 'line4', content: '' },
  { id: 'line5', content: 'greet("World");' },
  { id: 'line6', content: '// This is a comment line with some extra long text to test wrapping and overflow behavior. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 'line7', content: 'function anotherExample() {' },
  { id: 'line8', content: '  return true;' },
  { id: 'line9', content: '}' },
];

const alternativeCode: CodeData = [
  { id: 'alt-line1', content: '<html>' },
  { id: 'alt-line2', content: '  <head>' },
  { id: 'alt-line3', content: '    <title>My Page</title>' },
  { id: 'alt-line4', content: '  </head>' },
  { id: 'alt-line5', content: '  <body>' },
  { id: 'alt-line6', content: '    <h1>Welcome!</h1>' },
  { id: 'alt-line7', content: '  </body>' },
  { id: 'alt-line8', content: '</html>' },
];

const currentCodeData = ref<CodeData>(mockCode); // 使用200行mock数据进行测试
const isLineNumberPluginActive = ref(true);

const activePlugins = computed<Plugin[]>(() => {
  return isLineNumberPluginActive.value ? [lineNumberPlugin] : [];
});

const toggleLineNumberPlugin = () => {
  isLineNumberPluginActive.value = !isLineNumberPluginActive.value;
  // Note: The CodeViewer component now handles plugin installation/uninstallation reactively via the 'plugins' prop.
  // No need to call installPlugin/uninstallPlugin directly from here if using the prop-based approach.
};

const changeCode = () => {
  // 切换到较短的代码示例，或保持mockCode以持续测试无限滚动
  if (currentCodeData.value.length === 200 && currentCodeData.value[0].id === 'line1') { // 假设 mockCode 的第一行 id 是 'line1'
    currentCodeData.value = initialCode; // 切换到原始的 initialCode
  } else if (currentCodeData.value[0].id === 'line1' && currentCodeData.value.length !== 200) { // 如果是 initialCode
    currentCodeData.value = alternativeCode;
  } else if (currentCodeData.value[0].id === 'alt-line1') { // 如果是 alternativeCode
    currentCodeData.value = mockCode; // 切换回200行代码
  } else { // 如果是 mockCode 但不是以 line1 开头（理论上不应该发生，除非 mockCode 结构改变）
    currentCodeData.value = initialCode; // 默认切换到 initialCode
  }
};

</script>

<style scoped>
.demo-container {
  padding: 20px;
  font-family: sans-serif;
}

.controls {
  margin-bottom: 20px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

/* Add some basic styling for the demo page */
:global(body) {
  margin: 0;
}
</style>