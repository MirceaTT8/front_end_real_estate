<script setup>
import { ref, onMounted } from 'vue'
import { fetchMyLease } from "@/services/leaseService.js";
import { fetchPropertyById } from "@/services/propertyService.js";
import { getPaymentsByLeaseId } from "@/services/paymentService.js";
import { jwtDecode } from "jwt-decode";

import LeaseHeader from "@/components/tenant/lease/LeaseHeader.vue";
import LeasePropertyDetails from "@/components/tenant/lease/LeasePropertyDetails.vue";
import LeaseTerms from "@/components/tenant/lease/LeaseTerms.vue";
import PaymentHistory from "@/components/tenant/payment/PaymentHistory.vue";
import LeaseDocuments from "@/components/tenant/lease/LeaseDocuments.vue";
import LeaseNotes from "@/components/tenant/lease/LeaseNotes.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import NoLeaseMessage from "@/components/tenant/lease/NoLeaseMessage.vue";

const lease = ref(null);
const property = ref(null);
const payments = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const email = decoded?.sub;

    if (email) {
      loading.value = true;
      lease.value = await fetchMyLease();

      if (lease.value && lease.value.propertyId) {
        property.value = await fetchPropertyById(lease.value.propertyId);
        payments.value = await getPaymentsByLeaseId(lease.value.leaseId);
      }
    } else {
      error.value = 'Invalid user token.';
    }
  } catch (e) {
    console.error('JWT decode error:', e);
    error.value = 'Could not decode user token.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="loading" message="Loading your lease information..." />

    <template v-else>
      <NoLeaseMessage v-if="!lease" />

      <div v-else class="space-y-10 sm:space-y-12">
        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseHeader :lease="lease" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeasePropertyDetails :property="property" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseTerms :lease="lease" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <PaymentHistory :payments="payments" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseDocuments :lease="lease" />
        </div>

        <div class="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          <LeaseNotes :lease="lease" />
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
