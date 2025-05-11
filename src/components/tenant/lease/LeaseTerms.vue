<script setup>
import { computed } from 'vue'
import { formatDate } from '@/components/utils/formatters.js'

const props = defineProps({
  lease: {
    type: Object,
    required: true
  }
})

const currentDate = new Date()

const rentStatus = computed(() => {
  const dueDate = new Date(props.lease.startDate)
  dueDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), dueDate.getDate())

  return currentDate > dueDate
      ? { status: 'overdue', class: 'text-red-500 font-semibold' }
      : { status: 'current', class: 'text-green-600 font-semibold' }
})

const dueDay = new Date(props.lease.startDate).getDate()
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Lease Terms</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white shadow rounded p-5">
        <h3 class="font-semibold text-gray-800 mb-2">Duration</h3>
        <p class="text-gray-700">
          {{ formatDate(lease.startDate) }} -
          {{ lease.endDate ? formatDate(lease.endDate) : 'Undetermined' }}
        </p>
      </div>

      <div class="bg-white shadow rounded p-5">
        <h3 class="font-semibold text-gray-800 mb-2">Rent Information</h3>
        <p><strong>$</strong>{{ lease.monthlyRent.toFixed(2) }} per month</p>
        <p>Due on the {{ dueDay }}{{ dueDay === 1 ? 'st' : dueDay === 2 ? 'nd' : dueDay === 3 ? 'rd' : 'th' }} of each month</p>
        <p :class="rentStatus.class">Status: {{ rentStatus.status }}</p>
      </div>
    </div>
  </section>
</template>
