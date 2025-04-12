<script setup>
import { ref, onMounted, computed } from 'vue'

// Data
const payments = ref([])
const leases = ref([])
const properties = ref([])
const tenants = ref([])
const selectedLease = ref(null)
const showManualPaymentModal = ref(false)
const newPayment = ref({
  lease_id: null,
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'bank_transfer'
})

const initializeData = () => {
  leases.value = [
    {
      lease_id: 1,
      tenant_id: 2, // Jane Smith
      property_id: 2, // Downtown Loft
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      monthly_rent: 1800.00,
      status: 'active',
      created_at: '2024-01-01 00:00:00'
    }
  ]

  payments.value = [
    {
      payment_id: 1,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-01-05 14:30:00',
      payment_method: 'credit_card',
      status: 'completed'
    },
    {
      payment_id: 2,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-02-05 14:30:00',
      payment_method: 'credit_card',
      status: 'completed'
    },
    {
      payment_id: 3,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-03-05 14:30:00',
      payment_method: 'credit_card',
      status: 'pending'
    }
  ]

  properties.value = [
    {
      property_id: 1,
      owner_id: 1,
      name: 'Sunset Apartments',
      address: '123 Main St, Cityville',
      type: 'apartment',
      rent_amount: 1200.00,
      status: 'available',
      created_at: '2024-01-01 00:00:00'
    },
    {
      property_id: 2,
      owner_id: 1,
      name: 'Downtown Loft',
      address: '456 Elm St, Metropolis',
      type: 'apartment',
      rent_amount: 1800.00,
      status: 'rented',
      created_at: '2024-01-01 00:00:00'
    }
  ]

  tenants.value = [
    {
      user_id: 1,
      last_name: 'Doe',
      first_name: 'John',
      email: 'john.doe@example.com'
    },
    {
      user_id: 2,
      last_name: 'Smith',
      first_name: 'Jane',
      email: 'jane.smith@example.com'
    }
  ]
}

// Computed properties
const filteredPayments = computed(() => {
  return selectedLease.value
      ? payments.value.filter(p => p.lease_id === selectedLease.value)
      : payments.value
})

const summary = computed(() => {
  const completedPayments = payments.value.filter(p => p.status === 'completed')
  const activeLeases = leases.value.filter(l => l.status === 'active')
  const overduePayments = payments.value.filter(
      p => p.status === 'pending' && new Date(p.payment_date) < new Date()
  )

  return {
    totalCollected: completedPayments.reduce((sum, p) => sum + p.amount, 0),
    expectedMonthly: activeLeases.reduce((sum, l) => sum + l.monthly_rent, 0),
    overdueCount: overduePayments.length
  }
})

// Helper methods
const getTenantName = (tenantId) => {
  const tenant = tenants.value.find(t => t.user_id === tenantId)
  return tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown'
}

const getPropertyName = (propertyId) => {
  const property = properties.value.find(p => p.property_id === propertyId)
  return property ? property.name : 'Unknown'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Actions
const recordManualPayment = () => {
  payments.value.push({
    payment_id: Math.max(...payments.value.map(p => p.payment_id)) + 1,
    ...newPayment.value,
    status: 'completed'
  })
  showManualPaymentModal.value = false
  resetNewPayment()
}

const resetNewPayment = () => {
  newPayment.value = {
    lease_id: null,
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer'
  }
}

const sendReminders = () => {
  alert(`Reminders sent for ${summary.value.overdueCount} overdue payments!`)
}

// Initialize
onMounted(initializeData)
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Payment Management</h1>

    <!-- Lease Filter -->
    <div class="flex items-center gap-4 mb-6">
      <label class="font-medium text-gray-700">Filter by Lease:</label>
      <select
          v-model="selectedLease"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[300px]"
      >
        <option :value="null">All Leases</option>
        <option
            v-for="lease in leases"
            :key="lease.lease_id"
            :value="lease.lease_id"
        >
          {{ getPropertyName(lease.property_id) }} - {{ getTenantName(lease.tenant_id) }}
        </option>
      </select>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Collected</h3>
        <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(summary.totalCollected) }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Expected Monthly</h3>
        <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(summary.expectedMonthly) }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Overdue Payments</h3>
        <p class="text-2xl font-bold text-gray-800">{{ summary.overdueCount }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button
          @click="sendReminders"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md shadow-sm disabled:bg-amber-200 disabled:cursor-not-allowed transition-colors"
          :disabled="summary.overdueCount === 0"
      >
        Send Reminders ({{ summary.overdueCount }})
      </button>
      <button
          @click="showManualPaymentModal = true"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
      >
        Record Manual Payment
      </button>
    </div>

    <!-- Payment Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="payment in filteredPayments"
            :key="payment.payment_id"
            :class="{
              'text-green-600': payment.status === 'completed',
              'text-amber-600': payment.status === 'pending'
            }"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ payment.payment_id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ getPropertyName(leases.find(l => l.lease_id === payment.lease_id)?.property_id) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ getTenantName(leases.find(l => l.lease_id === payment.lease_id)?.tenant_id) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(payment.amount) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(payment.payment_date) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm capitalize">{{ payment.payment_method.replace('_', ' ') }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="{
                  'bg-green-100 text-green-800': payment.status === 'completed',
                  'bg-amber-100 text-amber-800': payment.status === 'pending'
                }"
              >
                {{ payment.status }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Manual Payment Modal -->
    <div v-if="showManualPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Record Manual Payment</h2>
          <form @submit.prevent="recordManualPayment">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Lease:</label>
              <select
                  v-model="newPayment.lease_id"
                  required
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option
                    v-for="lease in leases"
                    :key="lease.lease_id"
                    :value="lease.lease_id"
                >
                  {{ getPropertyName(lease.property_id) }} ({{ getTenantName(lease.tenant_id) }})
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
              <input
                  v-model.number="newPayment.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date:</label>
              <input
                  v-model="newPayment.payment_date"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method:</label>
              <select
                  v-model="newPayment.payment_method"
                  required
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div class="flex justify-end gap-3">
              <button
                  type="button"
                  @click="showManualPaymentModal = false"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>