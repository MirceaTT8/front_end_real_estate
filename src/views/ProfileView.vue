<script setup>
import { reactive, onMounted } from 'vue';
import { fetchUserByEmail } from '@/services/userService';
import { jwtDecode } from 'jwt-decode';

const user = reactive({
  firstName: '',
  lastName: '',
  email: ''
});

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const decoded = jwtDecode(token);
    const email = decoded.sub;
    const userData = await fetchUserByEmail(email);
    Object.assign(user, userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});
</script>


<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <h1 class="text-2xl font-bold mb-4">Profile Information</h1>

    <div class="mb-2">
      <span class="font-semibold">First Name:</span> {{ user.firstName }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Last Name:</span> {{ user.lastName }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Email:</span> {{ user.email }}
    </div>
  </div>
</template>
