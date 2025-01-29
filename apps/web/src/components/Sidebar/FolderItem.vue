<template>
  <div>
    <li class="cursor-pointer p-2 flex items-center">
      <i v-if="folder.childs && folder.childs.length" @click.stop="toggleFolder" class="pi mr-2 cursor-pointer" :class="expanded ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
      <div @click.stop="selectFolder" class="flex items-center w-full" :class="folder.childs || props.root ? 'ml-0' : 'ml-6'">
        <i :class="['pi', currentFolder?.id === folder.id ? 'pi-folder-open' : 'pi-folder', 'mr-2', { 'text-blue-500': currentFolder?.id === folder.id }]"></i>
        {{ folder.name }}
      </div>
    </li>
    <div v-if="expanded && folder.childs && folder.childs.length" class="ml-4">
      <FolderItem v-for="child in folder.childs" :key="child.id" :folder="child"/>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/main.store';
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FolderItem',
  props: {
    folder: Object,
    root: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const mainStore = useMainStore();
    const { currentFolder } = storeToRefs(mainStore);
    const expanded = ref(false);

    const toggleFolder = () => {
      expanded.value = !expanded.value;
    };

    const selectFolder = () => {
      mainStore.fetchDisplayFolder(props.folder.id);
    };

    return {
      props,
      expanded,
      currentFolder,
      toggleFolder,
      selectFolder,
    };
  },
});
</script>
