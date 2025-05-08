<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue' // 保留或移除原有组件
import DemoViewer from '../lib/example/Demo.vue'; // 导入新的Demo组件
</script>

<template>
  <!-- 可以保留或移除原有的Vite和Vue logo展示 -->
  <!--
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  -->
  <DemoViewer />
</template>

<style scoped>
/* 原有样式可以保留，或者根据需要调整 */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 为DemoViewer容器添加一些全局样式，如果需要 */
#app {
  /* text-align: center; */ /* 如果你希望内容居中 */
}
</style>
