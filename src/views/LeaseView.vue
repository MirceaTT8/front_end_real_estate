<script setup>

import {ref,onMounted} from "vue";
import {fetchActiveLeasesByOwnerId} from "@/services/leaseService.js";

const leases = ref([])
const loading = ref(true);
const error = ref(null)
onMounted(async () => {
  try{
    leases.value = await fetchActiveLeasesByOwnerId(1);
  } catch(error){
    error.value = error;
  }finally {
    loading.value = false
  }
})

</script>

<template>
  <div class>
    <h1>This is LeaseView</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h2>Active Leases</h2>
      <ul>
        <li v-for="lease in leases" :key="lease.leaseId">
          <strong>Lease ID:</strong> {{ lease.leaseId }} <br>
          <strong>Monthly Rent:</strong> ${{lease.monthlyRent}} <br>
          <strong>Status:</strong> {{lease.status}} <br>
        </li>
      </ul>
    </div>`
  </div>
</template>

<style scoped>

</style>