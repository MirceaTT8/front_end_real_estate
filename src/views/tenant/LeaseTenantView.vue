<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useTenantLeaseStore } from "@/stores/tenant/leaseTenantStore.js"
import { usePaymentTenantStore } from "@/stores/tenant/paymentTenantStore.js"
import { formatDate, formatCurrencyCompact } from '@/utils/formatters.js'

import LeaseHeader from '@/components/tenant/lease/LeaseHeader.vue'
import LeasePropertyDetails from '@/components/tenant/lease/LeasePropertyDetails.vue'
import LeaseTerms from '@/components/tenant/lease/LeaseTerms.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoLeaseMessage from '@/components/tenant/lease/NoLeaseMessage.vue'
import PendingLeaseMessage from "@/components/tenant/lease/PendingLeaseMessage.vue";
import ReviewModal from '@/components/tenant/review/ReviewModal.vue'

const tenantStore = useTenantLeaseStore()
const paymentStore = usePaymentTenantStore()

const showReviewModal = ref(false)
const selectedLeaseForReview = ref(null)

const today = ref(new Date())

const shouldShowNoLeaseMessage = computed(() => {
  return !tenantStore.loading && !tenantStore.tenantHasActiveLease && tenantStore.lease?.status !== 'PENDING'
})

const shouldShowPendingMessage = computed(() => {
  return !tenantStore.loading && tenantStore.lease?.status === 'PENDING'
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

const handleRefreshPending = async () => {
  await tenantStore.retryLoadLease()
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
      <!-- Pending Lease Message -->
      <PendingLeaseMessage
          v-if="shouldShowPendingMessage"
          @refresh="handleRefreshPending"
      />

      <!-- No Lease Message -->
      <NoLeaseMessage
          v-else-if="shouldShowNoLeaseMessage"
          :has-lease="tenantStore.tenantHasAnyLease"
          :loading="tenantStore.loading"
          :error="tenantStore.error"
          @retry="handleRetryLease"
          @contact-support="handleContactSupport"
          @write-review="handleWriteReview"
      />

      <!-- Active Lease Dashboard -->
      <div v-else-if="shouldShowLeaseDashboard" class="space-y-8">
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
            <div class="px-6 py-4">
              <h2 class="text-lg font-semibold text-gray-800">Lease Overview</h2>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <LeasePropertyDetails
                v-if="tenantStore.property"
                :property="tenantStore.property"
            />
            <LeaseTerms v-if="tenantStore.lease" :lease="tenantStore.lease" />
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