<script setup>
import { reactive, onMounted, ref } from 'vue';
import { fetchUserByEmail } from '@/services/userService';
import { jwtDecode } from 'jwt-decode';
import ProfileAvatar from "@/views/profile/ProfileAvatar.vue";
import ProfileDetailItem from "@/views/profile/ProfileDetailItem.vue";
import ProfileInputField from "@/views/profile/ProfileInputField.vue";
import ProfileTextareaField from "@/views/profile/ProfileTextareaField.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  bio: ''
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

// const saveProfile = async () => {
//   try {
//     isLoading.value = true;
//     const updatedUser = await updateUserProfile(user.email, tempProfile);
//     Object.assign(user, updatedUser);
//     isEditing.value = false;
//   } catch (err) {
//     error.value = err.message || 'Failed to update profile';
//   } finally {
//     isLoading.value = false;
//   }
// };

onMounted(fetchUserData);
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <div class="flex justify-between items-start mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
      <button
          v-if="!isEditing"
          @click="startEditing"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>
    </div>

    <LoadingSpinner v-if="isLoading" />
    <ErrorMessage v-else-if="error" :message="error" @retry="fetchUserData" />

    <template v-else>
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Profile Picture Column -->
        <div class="md:w-1/3 flex flex-col items-center">
          <ProfileAvatar :user="user" class="mb-4" />
          <p class="text-lg font-semibold">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>

        <!-- Profile Details Column -->
        <div class="md:w-2/3">
          <template v-if="!isEditing">
            <div class="space-y-4">
              <ProfileDetailItem label="First Name" :value="user.firstName" />
              <ProfileDetailItem label="Last Name" :value="user.lastName" />
              <ProfileDetailItem label="Email" :value="user.email" />
              <ProfileDetailItem label="Phone" :value="user.phone || 'Not provided'" />
              <ProfileDetailItem label="Address" :value="user.address || 'Not provided'" />
              <ProfileDetailItem label="Bio" :value="user.bio || 'Not provided'" />
            </div>
          </template>

          <template v-else>
            <form @submit.prevent="saveProfile" class="space-y-4">
              <ProfileInputField v-model="tempProfile.firstName" label="First Name" required />
              <ProfileInputField v-model="tempProfile.lastName" label="Last Name" required />
              <ProfileInputField v-model="tempProfile.email" label="Email" type="email" disabled />
              <ProfileInputField v-model="tempProfile.phone" label="Phone" type="tel" />
              <ProfileInputField v-model="tempProfile.address" label="Address" />
              <ProfileTextareaField v-model="tempProfile.bio" label="Bio" />

              <div class="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    @click="cancelEditing"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    :disabled="isLoading"
                >
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>