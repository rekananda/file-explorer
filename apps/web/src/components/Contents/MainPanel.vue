<template>
  <div class="w-3/4 bg-white p-4">
    <!-- Breadcrumb Path -->
    <div class="w-full bg-gray-200 p-3 rounded-md flex items-center space-x-2 overflow-x-auto mb-2">
      <span class="text-sm">{{ path }}</span>
    </div>

    <div v-if="isEmpty" class="flex justify-center items-center h-48 text-gray-500 text-lg">
      <i class="pi pi-inbox text-5xl mr-2"></i> Empty Folder
    </div>

    <div class="grid grid-cols-6 gap-4 relative">
      <div
        v-for="subfolder in displayFolder.folders"
        :key="subfolder.id"
        class="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg relative"
        @click="selectFolder(subfolder.id)"
        @contextmenu.prevent="openContextMenu($event, 'folder', subfolder.id)"
      >
        <i class="pi pi-folder text-yellow-500" style="font-size: 120px;"></i>
        <span class="text-sm text-center truncate w-24 overflow-hidden whitespace-nowrap">{{ subfolder.name }}</span>
      </div>

      <div
        v-for="file in displayFolder.files"
        :key="file.id"
        class="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg relative"
        @contextmenu.prevent="openContextMenu($event, 'file', file.id)"
      >
        <i class="pi pi-file text-gray-500" style="font-size: 120px;"></i>
        <span class="text-sm text-center truncate w-24 overflow-hidden whitespace-nowrap">{{ file.name }}</span>
      </div>
    </div>

    <div
      v-if="contextMenu.show"
      class="absolute bg-white shadow-lg rounded-md p-2 z-50"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <button class="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-500" @click="deleteItem">
        <i class="pi pi-trash mr-2"></i> Delete
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main.store';

export default defineComponent({
  name: 'MainPanel',
  setup() {
    const mainStore = useMainStore();
    const { displayFolder, path } = storeToRefs(mainStore);

    // State for Context Menu
    const contextMenu = ref({
      show: false,
      x: 0,
      y: 0,
      type: null,
      id: null,
    });

    // Check if the folder is empty
    const isEmpty = computed(() => {
      return displayFolder.value.folders.length === 0 && displayFolder.value.files.length === 0;
    });

    // Select a folder on left click
    const selectFolder = (folderId) => {
      mainStore.fetchDisplayFolder(folderId);
    };

    // Open Context Menu on Right Click
    const openContextMenu = (event, type, id) => {
      contextMenu.value = {
        show: true,
        x: event.clientX,
        y: event.clientY,
        type,
        id,
      };
    };

    // Close Context Menu on Click Anywhere
    const closeContextMenu = () => {
      contextMenu.value.show = false;
    };

    // Handle Delete Action
    const deleteItem = async () => {
      await mainStore.deleteItem(contextMenu.value.type, contextMenu.value.id);
      closeContextMenu();
      mainStore.fetchDisplayFolder(mainStore.currentFolder?.id || null);
    };

    // Close Context Menu when clicking anywhere
    window.addEventListener('click', closeContextMenu);

    return {
      path,
      displayFolder,
      selectFolder,
      isEmpty,
      contextMenu,
      openContextMenu,
      deleteItem,
    };
  },
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
