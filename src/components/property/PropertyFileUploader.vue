<script setup>
import { ref,computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  isLoading: Boolean
})

const emit = defineEmits(['update:modelValue'])

const attachments = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const fileInput = ref(null)

const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files) return

  const newAttachments = [...attachments.value]

  for (let i = 0; i < files.length; i++) {
    newAttachments.push({
      file: files[i],
      id: Date.now() + i,
      name: files[i].name,
      size: files[i].size,
      preview: files[i].type.startsWith('image/') ? URL.createObjectURL(files[i]) : null
    })
  }

  attachments.value = newAttachments
  event.target.value = ''
}

const removeAttachment = (index) => {
  const newAttachments = [...attachments.value]
  newAttachments.splice(index, 1)
  attachments.value = newAttachments
}
</script>

<template>
  <div>
    <label class="block mb-1">Property Images</label>
    <div class="border-2 border-dashed rounded-lg p-4">
      <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          @change="handleFileUpload"
          class="hidden"
      >
      <button
          type="button"
          @click="fileInput.click()"
          class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded transition"
          :disabled="isLoading"
      >
        Select Images
      </button>
      <p class="mt-2 text-sm text-gray-500">
        Upload property photos (JPEG, PNG)
      </p>
    </div>

    <!-- Preview of selected files -->
    <div v-if="attachments.length > 0" class="mt-4 space-y-2">
      <div v-for="(attachment, index) in attachments" :key="attachment.id" class="flex items-center p-2 border rounded">
        <div v-if="attachment.preview" class="w-12 h-12 mr-3">
          <img :src="attachment.preview" class="w-full h-full object-cover rounded" alt="Preview">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ attachment.name }}</p>
          <p class="text-xs text-gray-500">{{ (attachment.size / 1024).toFixed(2) }} KB</p>
        </div>
        <button
            type="button"
            @click="removeAttachment(index)"
            class="ml-2 p-1 text-red-500 hover:text-red-700"
            :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>