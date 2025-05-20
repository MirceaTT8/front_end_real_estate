<!-- LeasePropertyDetails.vue -->
<template>
  <div class="space-y-6">
    <!-- Property Card -->
    <div class="bg-gray-50 rounded-xl overflow-hidden">
      <div class="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>

      <!-- Property Info -->
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Property Information</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Address</h4>
              <p class="text-gray-800">{{ property.address }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Property Type</h4>
              <p class="text-gray-800">{{ property.type || 'Residential' }}</p>
            </div>
          </div>

<!--          <div class="space-y-4">-->
<!--            <div>-->
<!--              <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Year Built</h4>-->
<!--              <p class="text-gray-800">{{ property.yearBuilt || 'N/A' }}</p>-->
<!--            </div>-->

<!--            <div>-->
<!--              <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Square Footage</h4>-->
<!--              <p class="text-gray-800">{{ property.size ? `${property.size} sq ft` : 'N/A' }}</p>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>

    <!-- Amenities Section -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Amenities</h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="text-sm text-gray-700">Parking</span>
        </div>

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-sm text-gray-700">Garden</span>
        </div>

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-sm text-gray-700">Air Conditioning</span>
        </div>

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          <span class="text-sm text-gray-700">Heating</span>
        </div>

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="text-sm text-gray-700">Dishwasher</span>
        </div>

        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span class="text-sm text-gray-700">Laundry</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  property: {
    type: Object,
    required: true
  }
})
</script>