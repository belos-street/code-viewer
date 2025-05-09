<template>
  <div class="code-viewer">
    <div class="code-viewer-gutters">
      <!-- 插件可以在这里添加内容，例如行号 -->
      <div v-for="gutter in gutterComponents" :key="gutter.name">
        <component :is="gutter.component" :context="pluginContext" />
      </div>
    </div>
    <div class="code-viewer-content">
      <div class="view-lines">
        <div v-for="line in code" :key="line.id" :data-line-id="line.id" class="view-line">
          <template v-if="tokenize(line.content).length > 0">
            <span v-for="(token, tokenIndex) in tokenize(line.content)" :key="tokenIndex">{{ token }}</span>
          </template>
          <template v-else>
            <span>&nbsp;</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide, reactive, shallowRef, markRaw, defineProps, watch } from 'vue';
import type { PropType } from 'vue';
import { eventBus } from './eventBus';
import type { CodeData, Plugin, PluginContext } from './types';
import { tokenize, installPlugin, uninstallPlugin } from './api';

const props = defineProps({
  code: {
    type: Array as PropType<CodeData>,
    required: true,
    default: () => [],
  },
  plugins: {
    type: Array as PropType<Plugin[]>,
    default: () => [],
  },
});

const registeredPlugins = shallowRef<Map<string, Plugin>>(new Map());
const gutterComponents = shallowRef<Array<{ name: string; component: any }>>([]);

// 创建响应式的插件上下文
const pluginContext = reactive<PluginContext>({
  eventBus,
  getCodeData: () => props.code,
  // 核心API：注册Gutter组件，用于行号等插件
  registerGutterComponent: (name: string, component: any) => {
    const rawComponent = markRaw(component);
    if (!gutterComponents.value.find(gc => gc.name === name)) {
      gutterComponents.value.push({ name, component: rawComponent });
      // 按名称排序以确保一致性，或者可以根据插件加载顺序
      gutterComponents.value.sort((a, b) => a.name.localeCompare(b.name)); 
    }
  },
  unregisterGutterComponent: (name: string) => {
    gutterComponents.value = gutterComponents.value.filter(gc => gc.name !== name);
  },
});

provide('pluginContext', pluginContext);

// 暴露给父组件的方法，用于动态安装/卸载插件
// 注意：在 <script setup> 中，defineExpose 是自动的，但如果需要显式控制，可以这样
// defineExpose({
//   installPlugin,
//   uninstallPlugin,
// });

// 监听插件列表的变化
watch(() => props.plugins, (newPlugins, oldPlugins) => {
  const newPluginNames = new Set(newPlugins.map(p => p.name));
  const oldPluginNames = new Set(oldPlugins?.map(p => p.name) || []);

  // 卸载不再需要的插件
  oldPlugins?.forEach(plugin => {
    if (!newPluginNames.has(plugin.name)) {
      uninstallPlugin(plugin.name, pluginContext, registeredPlugins);
    }
  });

  // 安装新插件
  newPlugins.forEach(plugin => {
    if (!registeredPlugins.value.has(plugin.name)) {
      installPlugin(plugin, pluginContext, registeredPlugins);
    }
  });
}, { immediate: true, deep: true });

onMounted(() => {
  // 初始插件加载（如果通过 props 传递）
  props.plugins.forEach(plugin => {
    if (!registeredPlugins.value.has(plugin.name)) {
        installPlugin(plugin, pluginContext, registeredPlugins);
    }
  });
  eventBus.emit('codeviewer:mounted');
});

onBeforeUnmount(() => {
  // 组件卸载前卸载所有插件
  registeredPlugins.value.forEach(plugin => {
    uninstallPlugin(plugin.name, pluginContext, registeredPlugins);
  });
  eventBus.emit('codeviewer:beforeUnmount');
});

</script>

<style scoped>
.code-viewer {
  display: flex;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  border: 1px solid #ccc;
  overflow: auto;
  background-color: #f5f5f5;
  color:black
}

.code-viewer-gutters {
  padding: 10px 0px 10px 10px; /* 将右内边距调整为0，让行号插件的padding-right控制间距 */
  background-color: #eee;
  user-select: none; /* 禁止选择行号 */
  display: flex; /* 允许多个gutter组件并排 */
  flex-direction: column; /* 如果gutter组件是垂直堆叠的 */
}

.code-viewer-content {
  flex-grow: 1;
  padding: 10px 10px 10px 0px; /* 将左内边距调整为0，让行号插件的padding-right控制间距 */
  overflow: hidden; /* 默认隐藏滚动条 */
  /* white-space: pre; 已被移除，pre 和 code 元素会处理空白 */
}

.code-viewer:hover .code-viewer-content {
  overflow: auto; /* 鼠标悬停时显示滚动条 */
}

/* Webkit 浏览器滚动条样式 */
.code-viewer-content::-webkit-scrollbar {
  width: 8px;  /* 滚动条宽度 */
  height: 8px; /* 滚动条高度，用于水平滚动条 */
}

.code-viewer-content::-webkit-scrollbar-track {
  background: transparent; /* 轨道背景透明 */
}

.code-viewer-content::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4); /* 滑块颜色，半透明 */
  border-radius: 4px; /* 滑块圆角 */
}

.code-viewer-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 100, 100, 0.7); /* 鼠标悬停时滑块颜色 */
}

.code-viewer-content::-webkit-scrollbar-corner {
  background: transparent; /* 右下角交汇处背景透明 */
}

.code-viewer-content .view-lines {
  margin: 0;
  padding: 0;
  text-align: left; /* 确保代码块内容左对齐 */
}

.code-viewer-content .view-line {
  display: block; /* 每行代码占一行 */
  
  white-space: pre; /* 保留空白符，禁止自动换行 */
  /* word-break: break-all; 已被 white-space: pre 覆盖，不再需要 */
}
</style>