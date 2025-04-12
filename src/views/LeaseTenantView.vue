<script setup>
import { ref, onMounted, computed } from 'vue'
import {fetchLeaseId} from "@/services/leaseService.js";
import {fetchPropertyById} from "@/services/propertyService.js";

const lease = ref(null)
const property = ref(null)
const loading = ref(true)
const error = ref(null)
const currentDate = new Date()

const loadLeaseData = async (leaseId) => {
  loading.value = true
  error.value = null
  try {
    lease.value = await fetchLeaseId(leaseId)
    console.log(lease)

    if (lease.value && lease.value.propertyId) {
      property.value = await fetchPropertyById(lease.value.propertyId)
    }

    console.log(property)

  } catch (err) {
    error.value = 'Failed to load payments. Please try again later.'
    console.error('Payment load failed:', err.message)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const daysRemaining = (endDate) => {
  const end = new Date(endDate)
  const diff = end - currentDate
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const rentStatus = computed(() => {
  if (!lease.value) return ''
  const dueDate = new Date(currentDate)
  dueDate.setDate(lease.value.paymentDueDay)

  return currentDate > dueDate
      ? { status: 'overdue', class: 'text-red-500 font-semibold' }
      : { status: 'current', class: 'text-green-600 font-semibold' }
})

onMounted(() => {
  loadLeaseData(1)
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading your lease information...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-600">
      <p class="mb-4">⚠️ {{ error }}</p>
      <button @click="loadLeaseData" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Try Again
      </button>
    </div>

    <!-- Lease Info -->
    <div v-else-if="lease" class="space-y-12">
      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-4">
        <h1 class="text-2xl font-bold text-gray-800">Your Lease Agreement</h1>
        <span
            :class="{
            'bg-green-100 text-green-700': lease.status === 'active',
            'bg-red-100 text-red-600': lease.status === 'expired'
          }"
            class="px-4 py-1 rounded-full text-sm font-medium capitalize"
        >
          {{ lease.status }}
        </span>
      </div>

      <!-- Property Details -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Property Details</h2>
        <div class="bg-white shadow rounded p-6">
          <h3 class="text-lg font-bold text-gray-800">{{ property.name }}</h3>
          <p class="text-gray-600">{{ property.address }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
            <div><span class="font-semibold">Type:</span> {{ property.type }}</div>
<!--            <div><span class="font-semibold">Amenities:</span> {{ .property.amenities.join(', ') }}</div>-->
          </div>
        </div>
      </section>

      <!-- Lease Terms -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Lease Terms</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white shadow rounded p-5">
            <h3 class="font-semibold text-gray-800 mb-2">Duration</h3>
            <p class="text-gray-700">{{ formatDate(lease.startDate) }} - {{ formatDate(lease.endDate) }}</p>
            <p class="text-blue-600 font-medium mt-2">{{ daysRemaining(lease.endDate) }} days remaining</p>
          </div>
          <div class="bg-white shadow rounded p-5">
            <h3 class="font-semibold text-gray-800 mb-2">Rent Information</h3>
            <p><strong>$</strong>{{ lease.monthlyRent.toFixed(2) }} per month</p>
            <p>Due on the {{ lease.paymentDueDay }}th</p>
            <p :class="rentStatus.class">Status: {{ rentStatus.status }}</p>
          </div>
<!--          <div class="bg-white shadow rounded p-5">
            <h3 class="font-semibold text-gray-800 mb-2">Deposit</h3>
            <p><strong>$</strong>{{ lease.securityDeposit.toFixed(2) }}</p>
            <p v-if="lease.specialTerms.includes('Pets')">
              Pet Deposit: $500.00
            </p>
          </div>
          <div class="bg-white shadow rounded p-5">
            <h3 class="font-semibold text-gray-800 mb-2">Utilities</h3>
            <p><strong>Included:</strong> {{ lease.utilitiesIncluded.join(', ') }}</p>
            <p><strong>Tenant Pays:</strong> Electricity, Internet</p>
          </div>-->
        </div>
      </section>

      <!-- Payment History -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Payment History</h2>
        <div class="bg-white shadow rounded overflow-hidden">
          <div class="grid grid-cols-4 bg-gray-100 p-4 font-medium text-gray-700">
            <span>Month</span>
            <span>Amount</span>
            <span>Date Paid</span>
            <span>Status</span>
          </div>
          <div
              v-for="payment in lease.paymentHistory"
              :key="payment.month"
              class="grid grid-cols-4 p-4 border-t text-gray-700"
          >
            <span>{{ payment.month }}</span>
            <span>${{ payment.amount.toFixed(2) }}</span>
            <span>{{ formatDate(payment.date) }}</span>
            <span class="capitalize" :class="payment.status === 'paid' ? 'text-green-600' : 'text-red-500'">
              {{ payment.status }}
            </span>
          </div>
        </div>
      </section>

      <!-- Documents -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Lease Documents</h2>
        <div class="flex flex-wrap gap-4">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📄 Download Lease Agreement
          </button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            🏠 Property Rules
          </button>
        </div>
      </section>

      <!-- Notes -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Important Notes</h2>
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800">
          <p class="mb-2">{{ lease.specialTerms }}</p>
          <p>Please contact property management for any questions about your lease.</p>
        </div>
      </section>
    </div>

    <!-- No Lease -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 mb-4">You don't currently have an active lease.</p>
      <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Contact Property Management
      </button>
    </div>
  </div>
</template>
