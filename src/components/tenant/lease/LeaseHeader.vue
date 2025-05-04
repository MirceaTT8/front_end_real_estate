<template>
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
    <div>
      <h2 class="text-xl font-bold text-gray-800">{{ property?.name || 'Your Property' }}</h2>
      <p class="text-sm text-gray-500 mt-1">
        Owned by: <span class="text-gray-700 font-medium">{{ owner?.firstName || 'N/A' }} {{ owner?.lastName || 'N/A' }}</span>
      </p>
    </div>
    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="statusClass(lease.status)">
      {{ lease.status }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchPropertyById } from '@/services/propertyService.js'
import { fetchUserById } from '@/services/userService.js'

const props = defineProps({ lease: Object })

const property = ref(null)
const owner = ref(null)

onMounted(async () => {
  try {
    if (props.lease?.propertyId) {
      property.value = await fetchPropertyById(props.lease.propertyId)

      console.log(property.value)
      if (property.value?.ownerId) {
        owner.value = await fetchUserById(property.value.ownerId)
        console.log(owner.value)
      }
    }
  } catch (err) {
    console.error('Error loading lease header details:', err)
  }
})

const statusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'TERMINATED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>
