<script setup>
import { reactive, onMounted } from 'vue';
import { fetchUserById } from '@/services/userService';
const user = reactive({
  firstName: '',
  lastName: '',
  email: ''
});

onMounted(async () => {
  try {
    const userData = await fetchUserById(2);
    Object.assign(user, userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
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
<style scoped>

</style>