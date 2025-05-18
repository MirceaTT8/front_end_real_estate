<script setup>
import { onMounted } from 'vue'
import { useTenantLeaseStore} from "@/stores/leaseTenantStore.js";

import LeaseHeader from '@/components/tenant/lease/LeaseHeader.vue'
import LeasePropertyDetails from '@/components/tenant/lease/LeasePropertyDetails.vue'
import LeaseTerms from '@/components/tenant/lease/LeaseTerms.vue'
import PaymentHistory from '@/components/tenant/payment/PaymentHistory.vue'
import LeaseDocuments from '@/components/tenant/lease/LeaseDocuments.vue'
import LeaseNotes from '@/components/tenant/lease/LeaseNotes.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoLeaseMessage from '@/components/tenant/lease/NoLeaseMessage.vue'

const tenantStore = useTenantLeaseStore()

onMounted(() => {
  tenantStore.loadTenantLeaseData()
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="tenantStore.loading" message="Loading your lease information..." />

    <template v-else>
      <NoLeaseMessage v-if="!tenantStore.lease" />

      <div v-else class="space-y-10 sm:space-y-12">
        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseHeader :lease="tenantStore.lease" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeasePropertyDetails :property="tenantStore.property" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseTerms :lease="tenantStore.lease" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <PaymentHistory :payments="tenantStore.payments" />
        </div>

        <!-- <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseDocuments :lease="tenantStore.lease" />
        </div> -->

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseNotes :lease="tenantStore.lease" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .sm\:space-y-12 > * + * {
    margin-top: 2.5rem;
  }
}
</style>
