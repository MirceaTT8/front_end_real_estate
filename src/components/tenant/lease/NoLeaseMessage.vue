<!-- NoLeaseMessage.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <div class="px-6 py-8 md:px-10 md:py-12 text-center">
      <!-- Illustration -->
      <div class="flex justify-center mb-6">
        <div class="p-4 bg-blue-50 rounded-full inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <!-- Message Content -->
      <h2 class="text-2xl font-bold text-gray-900 mb-3">No Active Lease Found</h2>
      <p class="text-gray-600 max-w-lg mx-auto mb-8">
        You don't currently have an active lease in our system.
      </p>

    </div>

  </div>
</template>