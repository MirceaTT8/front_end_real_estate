<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useTenantLeaseStore } from "@/stores/tenant/leaseTenantStore.js"
import { usePaymentTenantStore } from "@/stores/tenant/paymentTenantStore.js"

import LeaseHeader from '@/components/tenant/lease/LeaseHeader.vue'
import LeasePropertyDetails from '@/components/tenant/lease/LeasePropertyDetails.vue'
import LeaseTerms from '@/components/tenant/lease/LeaseTerms.vue'
import PaymentHistory from '@/components/tenant/payment/PaymentHistory.vue'
import LeaseNotes from '@/components/tenant/lease/LeaseNotes.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoLeaseMessage from '@/components/tenant/lease/NoLeaseMessage.vue'
import ReviewModal from '@/components/tenant/review/ReviewModal.vue' // You'll need to create this

const tenantStore = useTenantLeaseStore()
const paymentStore = usePaymentTenantStore()
const activeTab = ref('overview')

// Review-related state
const showReviewModal = ref(false)
const selectedLeaseForReview = ref(null)

// Initialize dates for Next Payment card
const today = ref(new Date())

// Function to format currency values
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

// Computed property to determine if we should show the no lease message
const shouldShowNoLeaseMessage = computed(() => {
  return !tenantStore.loading && !tenantStore.tenantHasActiveLease
})

// Computed property to determine if we should show the main lease dashboard
const shouldShowLeaseDashboard = computed(() => {
  return !tenantStore.loading && tenantStore.tenantHasActiveLease && tenantStore.lease
})

// Handle retry from NoLeaseMessage component
const handleRetryLease = async () => {
  await tenantStore.retryLoadLease()
  if (tenantStore.lease) {
    await paymentStore.fetchPayments()
  }
}

// Handle contact support from NoLeaseMessage component
const handleContactSupport = () => {
  // You can implement this based on your app's support system
  // For example: open a modal, redirect to contact page, or open email client
  window.location.href = 'mailto:support@yourapp.com?subject=Lease Inquiry'
}

// Handle write review from NoLeaseMessage component
const handleWriteReview = (lease) => {
  selectedLeaseForReview.value = lease
  showReviewModal.value = true
}

// Handle review submission
const handleReviewSubmitted = async () => {
  showReviewModal.value = false
  selectedLeaseForReview.value = null
  // Optionally refresh the no lease message to update pending reviews
  // The NoLeaseMessage component will automatically refresh when mounted
}

// Handle review modal close
const handleReviewModalClose = () => {
  showReviewModal.value = false
  selectedLeaseForReview.value = null
}

onMounted(async () => {
  await tenantStore.loadTenantLeaseData()

  // Only fetch payments if tenant has an active lease
  if (tenantStore.tenantHasActiveLease) {
    await paymentStore.fetchPayments()
  }

  // Set up interval to update the date every minute
  const interval = setInterval(() => {
    today.value = new Date()
  }, 60000)

  // Store interval reference for cleanup
  window.dateUpdateInterval = interval
})

// Clean up interval when component is unmounted
onUnmounted(() => {
  if (window.dateUpdateInterval) {
    clearInterval(window.dateUpdateInterval)
    window.dateUpdateInterval = null
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <LoadingSpinner v-if="tenantStore.loading" message="Loading your lease information..." />

    <template v-else>
      <!-- No Lease Message with Review Integration -->
      <NoLeaseMessage
          v-if="shouldShowNoLeaseMessage"
          :has-lease="tenantStore.tenantHasAnyLease"
          :loading="tenantStore.loading"
          :error="tenantStore.error"
          @retry="handleRetryLease"
          @contact-support="handleContactSupport"
          @write-review="handleWriteReview"
      />

      <!-- Lease Dashboard -->
      <div v-if="shouldShowLeaseDashboard" class="space-y-8">
        <!-- Main Header with Gradient Background -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-8 sm:px-8">
            <LeaseHeader
                v-if="tenantStore.lease && !paymentStore.loading"
                :lease="tenantStore.lease"
                :nextPaymentDate="paymentStore.nextPaymentDate"
                :daysUntilNextPayment="paymentStore.daysUntilNextPayment"
            />

            <!-- Quick Stats Cards -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Monthly Rent Card -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div class="flex items-center">
                  <div class="p-3 bg-white/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/80">Monthly Rent</p>
                    <p class="text-2xl font-bold mt-1">{{ formatCurrency(tenantStore.lease.monthlyRent) }}</p>
                  </div>
                </div>
              </div>

              <!-- Next Payment Card -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div class="flex items-center">
                  <div class="p-3 bg-white/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/80">Next Payment</p>
                    <p class="text-2xl font-bold mt-1">{{ paymentStore.daysUntilNextPayment }} days</p>
                    <p class="text-xs mt-1 text-white/70">{{ paymentStore.nextPaymentDate ? paymentStore.nextPaymentDate.toLocaleDateString() : 'Calculating...' }}</p>
                  </div>
                </div>
              </div>

              <!-- Lease Status Card -->
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div class="flex items-center">
                  <div class="p-3 bg-white/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/80">Status</p>
                    <p class="text-2xl font-bold mt-1 capitalize">{{ tenantStore.lease.status.toLowerCase() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                  @click="activeTab = 'overview'"
                  class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                  :class="activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Overview
              </button>
              <button
                  @click="activeTab = 'payments'"
                  class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                  :class="activeTab === 'payments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Payments
              </button>
              <button
                  @click="activeTab = 'property'"
                  class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                  :class="activeTab === 'property' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Property
              </button>
              <button
                  @click="activeTab = 'notes'"
                  class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                  :class="activeTab === 'notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Notes
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'">
              <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Lease Overview</h2>
                <LeaseTerms :lease="tenantStore.lease" />
              </div>

              <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                <div class="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    Your lease is valid until {{ new Date(tenantStore.lease.endDate).toLocaleDateString() }}. Please contact your property manager if you have any questions.
                  </p>
                </div>
              </div>
            </div>

            <!-- Payments Tab -->
            <div v-if="activeTab === 'payments'">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Payment History</h2>
              <PaymentHistory :payments="tenantStore.payments" />
            </div>

            <!-- Property Tab -->
            <div v-if="activeTab === 'property'">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Property Information</h2>
              <LeasePropertyDetails :property="tenantStore.property" />
            </div>

            <!-- Notes Tab -->
            <div v-if="activeTab === 'notes'">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Lease Notes</h2>
              <LeaseNotes :lease="tenantStore.lease" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Review Modal -->
    <ReviewModal
        v-if="showReviewModal"
        :lease="selectedLeaseForReview"
        @close="handleReviewModalClose"
        @submitted="handleReviewSubmitted"
    />
  </div>
</template>

<style scoped>
/* You can add any component-specific styles here */
</style>