<template>
  <div class="flex h-screen">
    <LeftPanel />
    <RightPanel />
  </div>
</template>

<script setup>
  import LeftPanel from '@/components/Sidebar/index.vue';
  import RightPanel from '@/components/Contents/MainPanel.vue';
</script>