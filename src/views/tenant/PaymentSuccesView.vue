<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const sessionId = route.query.session_id

onMounted(async () => {
  if (!sessionId) {
    error.value = 'No session ID found.'
    loading.value = false
    return
  }
  setTimeout(() => router.push('/tenant/lease'), 3000)


  try {
    // Optional: confirm payment on backend (if needed)
    // await confirmStripePayment(sessionId)
    // Not implemented here — Stripe webhook should handle it.
  } catch (err) {
    error.value = 'Payment confirmation failed.'
    console.error(err)
  } finally {
    loading.value = false
  }
})


</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
      <template v-if="loading">
        <div class="animate-spin h-8 w-8 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">Verifying your payment...</p>
      </template>

      <template v-else-if="error">
        <h2 class="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
        <p class="text-gray-600">{{ error }}</p>
      </template>

      <template v-else>
        <h2 class="text-xl font-semibold text-green-600 mb-2">✅ Payment Successful!</h2>
        <p class="text-gray-700 mb-6">Thank you for your rent payment.</p>
        <button
            @click="router.push('/tenant/lease')"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </template>
    </div>
  </div>
</template>
