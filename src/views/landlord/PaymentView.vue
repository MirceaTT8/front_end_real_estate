<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPaymentsByOwnerId, createPayment } from "@/services/paymentService.js";
import { fetchPropertyById } from "@/services/propertyService.js";
import { fetchUserById } from "@/services/userService.js";
import { fetchActiveLeasesByOwnerId} from "@/services/leaseService.js";
// Data
const payments = ref([])
const leases = ref([])
const properties = ref([])
const tenants = ref([])
const selectedLease = ref(null)
const showManualPaymentModal = ref(false)
const error = ref(null)
const propertyCache = ref({})
const tenantCache = ref({})
const newPayment = ref({
  leaseId: null,
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'BANK_TRANSFER'
})

const fetchPayments = async () => {
  error.value = null
  try {

    const ownerId = 1
    payments.value = await getPaymentsByOwnerId(ownerId)

    const [paymentsData, leasesData] = await Promise.all([
      getPaymentsByOwnerId(ownerId),
      fetchActiveLeasesByOwnerId(ownerId)
    ])

    payments.value = paymentsData
    leases.value = leasesData

    console.log(payments)
    console.log(leases)

    const uniquePropertyIds = [...new Set(leases.value.map(l => l.propertyId))]
    const uniqueTenantIds = [...new Set(leases.value.map(l => l.tenantId))]

    console.log(uniquePropertyIds)
    console.log(uniqueTenantIds)

    await Promise.all([
      ...uniquePropertyIds.map(id =>
          fetchPropertyById(id).then(property => {
            propertyCache.value[id] = property
          })
      ),
      ...uniqueTenantIds.map(id =>
          fetchUserById(id).then(tenant => {
            tenantCache.value[id] = tenant
          })
      )
    ])

  } catch (err) {
    error.value = err.message || 'Failed to fetch payments'
    console.error('Error fetching payments:', err)
  }
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
  if (!tenantId) return 'Unknown'
  const tenant = tenantCache.value[tenantId] || tenants.value.find(t => t.userId === tenantId)
  return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
}

const getPropertyName = (propertyId) => {
  if (!propertyId) return 'Unknown'
  const property = propertyCache.value[propertyId] || properties.value.find(p => p.propertyId === propertyId)
  return property ? property.name : 'Unknown'
}

const getLeaseForPayment = (payment) => {
  return leases.value.find(l => l.lease_id === payment.lease_id)
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
const recordManualPayment = async () => {
  try {
    const paymentData = {
      amount: newPayment.value.amount,
      paymentDate: newPayment.value.paymentDate,
      paymentMethod: newPayment.value.paymentMethod,
      status: 'PENDING'
    };

    console.log(paymentData)

    const createdPayment = await createPayment(newPayment.value.leaseId, paymentData);

    payments.value.push({
      ...createdPayment,
    });

    showManualPaymentModal.value = false;
    resetNewPayment();

  } catch (error) {
    error.value = error.message || 'Failed to record payment';
    console.error('Error recording payment:', error);
  }
}
const resetNewPayment = () => {
  newPayment.value = {
    leaseId: null,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER'
  }
}

const sendReminders = () => {
  alert(`Reminders sent for ${summary.value.overdueCount} overdue payments!`)
}

// Initialize
onMounted(() => {
  fetchPayments()
})
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
          {{ getPropertyName(lease.propertyId) }} - {{ getTenantName(lease.tenantId) }}
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
            :key="payment.paymentId"
            :class="{
              'text-green-600': payment.status === 'completed',
              'text-amber-600': payment.status === 'pending'
            }"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ payment.paymentId }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ getPropertyName(getLeaseForPayment(payment)?.propertyId) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ getTenantName(getLeaseForPayment(payment)?.tenantId) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(payment.amount) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(payment.paymentDate) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm capitalize">{{ payment.paymentMethod.replace('_', ' ') }}</td>
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
                  v-model="newPayment.leaseId"
                  required
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option
                    v-for="lease in leases"
                    :key="lease.leaseId"
                    :value="lease.leaseId"
                >
                  {{ getPropertyName(lease.propertyId) }} ({{ getTenantName(lease.tenantId) }})
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
                  v-model="newPayment.paymentDate"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method:</label>
              <select
                  v-model="newPayment.paymentMethod"
                  required
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Cash</option>
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