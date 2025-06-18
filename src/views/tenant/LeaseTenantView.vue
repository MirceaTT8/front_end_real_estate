
<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useTenantLeaseStore } from "@/stores/tenant/leaseTenantStore.js"
import { usePaymentTenantStore } from "@/stores/tenant/paymentTenantStore.js"
import { formatDate, formatCurrencyCompact } from '@/utils/formatters.js'

import LeaseHeader from '@/components/tenant/lease/LeaseHeader.vue'
import LeasePropertyDetails from '@/components/tenant/lease/LeasePropertyDetails.vue'
import LeaseTerms from '@/components/tenant/lease/LeaseTerms.vue'
import PaymentHistory from '@/components/tenant/payment/PaymentHistory.vue'
import LeaseNotes from '@/components/tenant/lease/LeaseNotes.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoLeaseMessage from '@/components/tenant/lease/NoLeaseMessage.vue'
import ReviewModal from '@/components/tenant/review/ReviewModal.vue'

const tenantStore = useTenantLeaseStore()
const paymentStore = usePaymentTenantStore()
const activeTab = ref('overview')

const showReviewModal = ref(false)
const selectedLeaseForReview = ref(null)

const today = ref(new Date())

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0"/></svg>'
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>'
  }
]

const shouldShowNoLeaseMessage = computed(() => {
  return !tenantStore.loading && !tenantStore.tenantHasActiveLease
})

const shouldShowLeaseDashboard = computed(() => {
  return !tenantStore.loading && tenantStore.tenantHasActiveLease && tenantStore.lease
})

const handleRetryLease = async () => {
  await tenantStore.retryLoadLease()
  if (tenantStore.lease) {
    await paymentStore.fetchPayments()
  }
}

const handleContactSupport = () => {
  window.location.href = 'mailto:support@yourapp.com?subject=Lease Inquiry'
}

const handleWriteReview = (lease) => {
  selectedLeaseForReview.value = lease
  showReviewModal.value = true
}

const handleReviewSubmitted = async () => {
  showReviewModal.value = false
  selectedLeaseForReview.value = null
}

const handleReviewModalClose = () => {
  showReviewModal.value = false
  selectedLeaseForReview.value = null
}

onMounted(async () => {
  await tenantStore.loadTenantLeaseData()

  if (tenantStore.tenantHasActiveLease) {
    await paymentStore.fetchPayments()
  }

  const interval = setInterval(() => {
    today.value = new Date()
  }, 60000)

  window.dateUpdateInterval = interval
})

onUnmounted(() => {
  if (window.dateUpdateInterval) {
    clearInterval(window.dateUpdateInterval)
    window.dateUpdateInterval = null
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="tenantStore.loading" message="Loading your lease information..." />

    <template v-else>
      <NoLeaseMessage
          v-if="shouldShowNoLeaseMessage"
          :has-lease="tenantStore.tenantHasAnyLease"
          :loading="tenantStore.loading"
          :error="tenantStore.error"
          @retry="handleRetryLease"
          @contact-support="handleContactSupport"
          @write-review="handleWriteReview"
      />

      <div v-if="shouldShowLeaseDashboard" class="space-y-8">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-8 sm:px-8">
            <LeaseHeader
                v-if="tenantStore.lease && !paymentStore.loading"
                :lease="tenantStore.lease"
                :nextPaymentDate="paymentStore.nextPaymentDate"
                :daysUntilNextPayment="paymentStore.daysUntilNextPayment"
            />

            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div class="flex items-center">
                  <div class="p-3 bg-white/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/80">Monthly Rent</p>
                    <p class="text-2xl font-bold mt-1">{{ formatCurrencyCompact(tenantStore.lease.monthlyRent) }}</p>
                  </div>
                </div>
              </div>

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
                    <p class="text-xs mt-1 text-white/70">{{ paymentStore.nextPaymentDate ? formatDate(paymentStore.nextPaymentDate) : 'No payment due' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div class="flex items-center">
                  <div class="p-3 bg-white/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-white/80">Lease Status</p>
                    <p class="text-lg font-bold mt-1 capitalize">{{ tenantStore.lease.status.toLowerCase() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200 bg-gray-50">
            <nav class="flex space-x-8 px-6" aria-label="Tabs">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
                  ]"
              >
                <div class="flex items-center">
                  <span v-html="tab.icon" class="mr-2"></span>
                  {{ tab.label }}
                </div>
              </button>
            </nav>
          </div>

          <div class="p-6">
            <div v-show="activeTab === 'overview'" class="space-y-6">
              <LeasePropertyDetails
                  v-if="tenantStore.property"
                  :property="tenantStore.property"
              />
              <LeaseTerms v-if="tenantStore.lease" :lease="tenantStore.lease" />
            </div>

            <div v-show="activeTab === 'payments'" class="space-y-6">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Overview</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center">
                    <p class="text-sm text-green-700 font-medium">Monthly Rent</p>
                    <p class="text-2xl font-bold text-gray-800">{{ formatCurrencyCompact(tenantStore.lease.monthlyRent) }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-green-700 font-medium">Security Deposit</p>
                    <p class="text-2xl font-bold text-gray-800">{{ formatCurrencyCompact(tenantStore.lease.securityDeposit || 0) }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-green-700 font-medium">Next Payment</p>
                    <p class="text-lg font-semibold text-gray-800">{{ paymentStore.daysUntilNextPayment }} days</p>
                  </div>
                </div>
              </div>
              <PaymentHistory :payments="paymentStore.payments" />
            </div>

            <div v-show="activeTab === 'documents'" class="space-y-6">
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Documents Coming Soon</h3>
                <p class="text-gray-600">Lease documents and agreements will be available here.</p>
              </div>
            </div>

            <div v-show="activeTab === 'notes'" class="space-y-6">
              <LeaseNotes v-if="tenantStore.lease" :lease="tenantStore.lease" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <ReviewModal
        v-if="showReviewModal && selectedLeaseForReview"
        :lease="selectedLeaseForReview"
        @close="handleReviewModalClose"
        @review-submitted="handleReviewSubmitted"
    />
  </div>
</template>
