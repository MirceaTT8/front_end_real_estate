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
        You don't currently have an active lease in our system. If you believe this is an error or you need to set up a new lease, please contact your property management team.
      </p>

      <!-- Action Buttons -->
      <div class="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
        <button class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Contact Property Management
        </button>

        <button class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Browse Available Properties
        </button>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="bg-gray-50 border-t border-gray-100 px-6 py-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>

      <dl class="space-y-6">
        <div>
          <dt class="text-sm font-medium text-gray-900">Why don't I see my lease?</dt>
          <dd class="mt-1 text-sm text-gray-600">
            Your lease may still be in the approval process or may have expired. Please contact your property manager for more information.
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-900">How do I sign a new lease?</dt>
          <dd class="mt-1 text-sm text-gray-600">
            To sign a new lease, you'll need to contact your property management team who will guide you through the application and approval process.
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-900">I just signed my lease. When will it appear here?</dt>
          <dd class="mt-1 text-sm text-gray-600">
            It typically takes 24-48 hours for a newly signed lease to appear in your tenant portal. If it's been longer, please contact support.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>