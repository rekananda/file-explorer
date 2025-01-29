<template>
  <div class="w-1/4 bg-gray-100 p-4">
    <h2 class="font-bold mb-4">Folders</h2>
    <ul>
      <FolderItem :folder="rootFolder" :root="true" />
      <FolderItem v-for="folder in folderTree" :key="folder.id" :folder="folder" />
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/stores/main.store';
import FolderItem from './FolderItem.vue';

export default defineComponent({
  name: 'Sidebar',
  components: { FolderItem },
  setup() {
    const mainStore = useMainStore();
    const { folderTree } = storeToRefs(mainStore);
    const rootFolder = ref({
        id: undefined,
        name: "/",
      });

    onMounted(() => {
      mainStore.fetchFolderTree();
      mainStore.fetchDisplayFolder();
    });

    return {
      rootFolder,
      folderTree,
    };
  },
});
</script>
