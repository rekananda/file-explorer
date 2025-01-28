<template>
  <div class="w-3/4 bg-white p-4">
    <h2 class="font-bold mb-4">Folder Contents</h2>
    <h3 class="mb-2">Subfolders</h3>
    <ul>
      <li
        v-for="subfolder in displayFolder.folders"
        :key="subfolder.id"
        class="cursor-pointer hover:bg-gray-200 p-2"
        @click="selectFolder(subfolder.id)"
      >
        <i class="pi pi-folder mr-2"></i>{{ subfolder.name }}
      </li>
    </ul>

      <h3 class="mt-4 mb-2">Files</h3>
    <ul>
      <li
        v-for="file in displayFolder.files"
        :key="file.id"
        class="hover:bg-gray-200 p-2"
      >
        <i class="pi pi-file mr-2"></i>{{ file.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useMainStore } from '@/stores/main.store';

  export default defineComponent({
    name: 'MainPanel',
    setup() {
      const mainStore = useMainStore();
      const { displayFolder, fetchDisplayFolder } = storeToRefs(mainStore);

      const selectFolder = (folderId) => {
        fetchDisplayFolder(folderId);
      };

      return {
        displayFolder,
        selectFolder,
      };
    },
  });
</script>
