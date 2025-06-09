<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmStripePayment } from '@/services/paymentService.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const sessionId = route.query.session_id
  if (!sessionId) {
    error.value = 'No session ID found.'
    loading.value = false
    return
  }
  console.log('Loaded PaymentSuccessView with session:', sessionId)

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await confirmStripePayment(sessionId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTimeout(() => router.push('/tenant/leases'), 3000)
  } catch (err) {
    error.value = 'Payment confirmation failed.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="flex justify-center">
          <div class="w-16 h-16 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p class="text-xl text-gray-700 font-semibold">Verifying your payment...</p>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="space-y-6">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-red-600">Payment Failed</h2>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <!-- Success State -->
      <div v-else class="space-y-6">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-green-600">Payment Successful!</h2>
        <p class="text-gray-700 text-lg">Thank you for your rent payment.</p>
        <button
            @click="router.push('/tenant/leases')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-6"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>