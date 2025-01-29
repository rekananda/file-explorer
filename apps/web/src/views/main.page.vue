<template>
  <div class="h-screen">
    <Menubar />
    <div class="flex flex-1 main-panel">
      <LeftPanel />
      <RightPanel />
    </div>
  </div>
</template>

<script setup>
  import Menubar from '@/components/Menubar/index.vue'
  import LeftPanel from '@/components/Sidebar/index.vue';
  import RightPanel from '@/components/Contents/MainPanel.vue';
</script>

<style scoped>
  .main-panel {
    align-items: stretch;
    height: calc(100dvh - 60px);
  }
</style>