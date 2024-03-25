<template>
  <div id="app">
    <router-view />
    <!-- 子应用挂载节点 -->
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
