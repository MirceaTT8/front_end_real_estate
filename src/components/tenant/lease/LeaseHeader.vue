<template>
  <div class="text-white">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white">{{ property?.name || 'Your Property' }}</h1>
        <p class="text-blue-100 mt-1">
          <span class="opacity-80">Owned by:</span> {{ owner?.firstName || 'N/A' }} {{ owner?.lastName || 'N/A' }}
        </p>
        <p class="text-blue-100 mt-0.5">
          <span class="opacity-80">Lease #:</span> {{ lease.leaseId }}
        </p>
        <p class="text-blue-100 mt-0.5">
          <span class="opacity-80">Next Payment Due:</span> {{ formatDate(nextPaymentDate) }}
        </p>
      </div>
      <span
          class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
          :class="statusClass(lease.status)"
      >
        <span :class="statusDot(lease.status)" class="h-2 w-2 mr-1.5 rounded-full"></span>
        {{ lease.status }}
      </span>
    </div>

    <div class="hidden sm:block mt-4">
      <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
            class="h-full bg-white rounded-full"
            :style="{ width: leaseProgress + '%' }"
        ></div>
      </div>
      <div class="flex justify-between mt-2 text-xs text-blue-100">
        <div>Start: {{ formatDate(lease.startDate) }}</div>
        <div>End: {{ formatDate(lease.endDate) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchPropertyById } from '@/services/propertyService.js'
import { fetchUserById } from '@/services/userService.js'

const props = defineProps({ lease: Object })

const property = ref(null)
const owner = ref(null)

const leaseProgress = computed(() => {
  if (!props.lease?.startDate || !props.lease?.endDate) return 0;

  const start = new Date(props.lease.startDate).getTime();
  const end = new Date(props.lease.endDate).getTime();
  const today = new Date().getTime();

  const totalDuration = end - start;
  const elapsedTime = today - start;
  const progress = (elapsedTime / totalDuration) * 100;

  return Math.min(Math.max(progress, 0), 100);
})

onMounted(async () => {
  try {
    if (props.lease?.propertyId) {
      property.value = await fetchPropertyById(props.lease.propertyId)

      if (property.value?.ownerId) {
        owner.value = await fetchUserById(property.value.ownerId)
      }
    }
  } catch (err) {
    console.error('Error loading lease header details:', err)
  }
})

// ✅ Compute the next valid payment date based on due day and calendar month
const nextPaymentDate = computed(() => {
  const leaseStart = new Date(props.lease.startDate)
  const dueDay = leaseStart.getDate()
  const today = new Date()

  let targetMonth = today.getMonth()
  let targetYear = today.getFullYear()

  if (today.getDate() > dueDay) {
    targetMonth += 1
    if (targetMonth > 11) {
      targetMonth = 0
      targetYear += 1
    }
  }

  const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  const correctedDay = Math.min(dueDay, daysInTargetMonth)

  return new Date(targetYear, targetMonth, correctedDay)
})

const formatDate = (dateStringOrDate) => {
  const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate
  if (!date || isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const statusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-400 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30'
    case 'PENDING': return 'bg-yellow-400 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30'
    case 'TERMINATED': return 'bg-red-400 bg-opacity-20 text-red-100 border border-red-400 border-opacity-30'
    default: return 'bg-gray-400 bg-opacity-20 text-gray-100 border border-gray-400 border-opacity-30'
  }
}

const statusDot = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-400'
    case 'PENDING': return 'bg-yellow-400'
    case 'TERMINATED': return 'bg-red-400'
    default: return 'bg-gray-400'
  }
}
</script>
