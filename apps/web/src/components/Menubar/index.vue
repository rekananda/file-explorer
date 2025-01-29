<template>
  <div class="bg-gray-200 p-4 flex justify-between items-center shadow-md">
    <h1 class="text-lg font-semibold">File Explorer</h1>

    <!-- Dropdown Menu Add -->
    <div class="relative">
      <Button label="Add" icon="pi pi-plus" @click="toggleDropdown" class="p-button-sm" />
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 z-50"
      >
        <button @click="openModal('folder')" class="w-full text-left p-2 hover:bg-gray-200">
          <i class="pi pi-folder mr-2"></i> Add Folder
        </button>
        <button @click="openModal('file')" class="w-full text-left p-2 hover:bg-gray-200">
          <i class="pi pi-file mr-2"></i> Add File
        </button>
      </div>
    </div>
  </div>
  <ModalCreate
    :isVisible="modalOpen"
    :modalType="modalType"
    :modalTitle="modalTitle"
    @update:isVisible="modalOpen = $event"
    @save="handleSave"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import ModalCreate from "@/components/Modals/ModalCreate.vue"
  import Button from 'primevue/button';
  import { storeToRefs } from 'pinia';
  import { useMainStore } from '@/stores/main.store';
  
  const mainStore = useMainStore();

  const dropdownOpen = ref(false);
  const modalOpen = ref(false);
  const modalType = ref('');
  const modalTitle = ref('');

  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
  };

  const openModal = (type) => {
    modalType.value = type;
    modalTitle.value = type === 'folder' ? 'Add New Folder' : 'Make TXT File';
    modalOpen.value = true;
    dropdownOpen.value = false;
  };

  const handleSave = (data) => {
    mainStore.postCreate(data.type, data.name);
  };
</script>