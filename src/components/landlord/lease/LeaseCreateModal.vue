<script setup>
import {onMounted, ref} from 'vue'
import { createInvitation } from '@/services/leaseService.js'
import { fetchMyProperties} from "@/services/propertyService.js";

const emit = defineEmits(['cancel', 'success'])

const lease = ref({
  propertyId: null,
  tenantEmail: '',
  startDate: '',
  endDate: '',
  monthlyRent: 0
})

const loading = ref(false)
const errorMsg = ref(null)
const properties = ref([])

onMounted(async () => {
  try {
    const result = await fetchMyProperties()
    properties.value = result.filter(p => p.status === 'AVAILABLE')
  } catch (e) {
    console.error('Failed to load properties', e)
    errorMsg.value = 'Failed to load properties.'
  }
})

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    await createInvitation(lease.value)
    emit('success')
  } catch (error) {
    errorMsg.value = error.message || 'Failed to send invitation.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Send Lease Invitation</h2>

        <div v-if="errorMsg" class="text-red-600 text-sm mb-4">
          {{ errorMsg }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
                v-model="lease.propertyId"
                class="w-full p-2 border rounded"
                required
            >
              <option value="" disabled selected>Select a property</option>
              <option v-for="p in properties" :key="p.propertyId" :value="p.propertyId">
                {{ p.name }} - {{ p.address }}
              </option>
            </select>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tenant Email</label>
            <input
                v-model="lease.tenantEmail"
                type="email"
                class="w-full p-2 border rounded"
                placeholder="Enter tenant email"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                  v-model="lease.startDate"
                  type="date"
                  class="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                  v-model="lease.endDate"
                  type="date"
                  class="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
            <input
                v-model.number="lease.monthlyRent"
                type="number"
                class="w-full p-2 border rounded"
                placeholder="0.00"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
              @click="emit('cancel')"
              class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
              @click="handleSubmit"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {{ loading ? 'Sending...' : 'Send Invitation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
