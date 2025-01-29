<template>
  <Dialog 
    :visible="isVisible" 
    :header="modalTitle" 
    modal
    dismissableMask
    class="w-96"
    @update:visible="closeModal"
  >
    <div v-if="modalType === 'folder'">
      <label class="block mb-2 font-semibold">Folder Name</label>
      <InputText v-model="inputName" class="w-full p-2 border rounded-md" />
    </div>

    <div v-if="modalType === 'file'">
      <label class="block mb-2 font-semibold">File Name</label>
      <InputText v-model="inputName" class="w-full p-2 border rounded-md" />
    </div>

    <template #footer>
      <Button label="Cancel" class="p-button p-button-text" @click="closeModal" />
      <Button label="Save" class="p-button p-button-primary" @click="saveData" />
    </template>
  </Dialog>
</template>


<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({
  isVisible: Boolean,
  modalType: String,
  modalTitle: String,
});

const emit = defineEmits(['update:isVisible', 'save']);

const inputName = ref('');
const selectedFile = ref(null);

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    inputName.value = '';
    selectedFile.value = null;
  }
});

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const closeModal = () => {
  emit('update:isVisible', false);
};

const saveData = () => {
  emit('save', { type: props.modalType, name: inputName.value });
  closeModal();
};
</script>