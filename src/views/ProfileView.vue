<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { fetchUserByEmail } from '@/services/userService';
import { jwtDecode } from 'jwt-decode';
import ProfileAvatar from "@/views/profile/ProfileAvatar.vue";
import ProfileDetailItem from "@/views/profile/ProfileDetailItem.vue";
import ProfileInputField from "@/views/profile/ProfileInputField.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const isEditing = ref(false);
const isLoading = ref(true);
const error = ref(null);
const tempProfile = reactive({});

const fetchUserData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const token = localStorage.getItem('token');
    if (!token) throw new Error('User not authenticated');

    const decoded = jwtDecode(token);
    const userData = await fetchUserByEmail(decoded.sub);
    Object.assign(user, userData);
  } catch (err) {
    error.value = err.message || 'Failed to load profile data';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
};

const startEditing = () => {
  Object.assign(tempProfile, user);
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

onMounted(fetchUserData);
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
    <!-- Header Section with Background -->
    <div class="relative mb-8">
      <!-- Background Banner -->
      <div class="h-32 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl"></div>

      <!-- Profile Header -->
      <div class="relative px-6 -mt-16 flex flex-col md:flex-row justify-between items-center">
        <!-- Avatar and Name -->
        <div class="flex flex-col items-center md:items-start md:flex-row md:space-x-4">
          <div class="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4 md:mb-0">
            <ProfileAvatar :user="user" />
          </div>
          <div class="text-center md:text-left mt-2">
            <h1 class="text-2xl font-bold text-gray-800">{{ user.firstName }} {{ user.lastName }}</h1>
            <p class="text-gray-500">{{ user.email }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 md:mt-0">
          <button
              v-if="!isEditing"
              @click="startEditing"
              class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-6">
      <ErrorMessage :message="error" @retry="fetchUserData" />
    </div>

    <!-- Profile Content -->
    <div v-else class="space-y-6">
      <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h2 class="text-lg font-medium text-gray-800 mb-6 flex items-center border-b border-gray-200 pb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>

        <!-- View Mode -->
        <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
            <p class="text-sm font-medium text-gray-500 mb-1">First Name</p>
            <p class="text-lg font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ user.firstName }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
            <p class="text-sm font-medium text-gray-500 mb-1">Last Name</p>
            <p class="text-lg font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ user.lastName }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
            <p class="text-sm font-medium text-gray-500 mb-1">Email Address</p>
            <p class="text-lg font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ user.email }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
            <p class="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
            <p class="text-lg font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ user.phone || 'Not provided' }}
            </p>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                    id="firstName"
                    v-model="tempProfile.firstName"
                    type="text"
                    required
                    class="pl-10 block w-full border border-gray-300 rounded-lg py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                    id="lastName"
                    v-model="tempProfile.lastName"
                    type="text"
                    required
                    class="pl-10 block w-full border border-gray-300 rounded-lg py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                    id="email"
                    v-model="tempProfile.email"
                    type="email"
                    disabled
                    class="pl-10 block w-full border border-gray-300 rounded-lg py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
            </div>

            <div class="space-y-1">
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                    id="phone"
                    v-model="tempProfile.phone"
                    type="tel"
                    class="pl-10 block w-full border border-gray-300 rounded-lg py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. (123) 456-7890"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
                type="button"
                @click="cancelEditing"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
                type="submit"
                class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center shadow-sm"
                :disabled="isLoading"
            >
              <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add subtle hover effect for profile items */
.hover\:shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Add smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Ensure proper sizing for the profile picture */
.w-24 {
  min-width: 6rem;
}

/* Add focus styles for input fields */
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

[v-cloak] {
  display: none;
}
</style>