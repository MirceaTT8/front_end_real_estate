

<template>
  <div>
    <h1>Properties for User</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="property in properties" :key="property.propertyId">
          {{ property.name }} - {{ property.address }} ({{ property.status }})
        </li>
      </ul>
    </div>
    <div v-if="error" class="error">
      Error: {{ error.message }}
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { fetchPropertiesByUserId } from '@/services/propertyService.js';

export default {
  /*  props: {
      userId: {
        type: Number,
        required: true,
      },*/
  // },

  setup(props) {
    const properties = ref([]);
    const loading = ref(true);
    const error = ref(null);

    onMounted(async () => {
      try {
        console.log(properties)
        properties.value = await fetchPropertiesByUserId(1);
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    });

    return {
      properties,
      loading,
      error,
    };
  },
};


</script>

<style scoped>
.error {
  color: red;
}
</style>