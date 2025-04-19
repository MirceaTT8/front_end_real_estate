<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchPropertiesByUserId } from '@/services/propertyService.js'
import PropertyFilters from '@/components/property/PropertyFilters.vue'
import PropertyList from "@/components/property/PropertyList.vue";
import PropertyMap from "@/components/property/PropertyMap.vue";
import PropertyViewToggle from "@/components/property/PropertyViewToggle.vue";

const properties = ref([])
const loading = ref(true)
const error = ref(null)
const showMapView = ref(false)

const filters = ref({
  location: '',
  type: '',
  status: ''
})

const filterOptions = {
  types: ['Apartment', 'House', 'Commercial', 'Land'],
  statuses: ['Available', 'Occupied', 'Maintenance']
}

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesLocation = !filters.value.location ||
        property.address.toLowerCase().includes(filters.value.location.toLowerCase())

    const matchesType = !filters.value.type ||
        property.type.toLowerCase() === filters.value.type.toLowerCase()

    const matchesStatus = !filters.value.status ||
        property.status.toLowerCase() === filters.value.status.toLowerCase()

    return matchesLocation && matchesType && matchesStatus
  })
})

const resetFilters = () => {
  filters.value = {
    location: '',
    type: '',
    status: ''
  }
}

const onFiltersUpdate = (newFilters) => {
  filters.value = { ...newFilters }
}

onMounted(async () => {
  try {
    properties.value = await fetchPropertiesByUserId(1)
    console.log(properties.value)
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-semibold text-gray-800 mb-8">My Properties</h1>

    <PropertyViewToggle v-model:showMap="showMapView" />

    <PropertyFilters
        :filters="filters"
        :filterOptions="filterOptions"
        @update:filters="onFiltersUpdate"
    />

    <PropertyMap
        v-if="showMapView"
        :properties="filteredProperties"
        :show-map="showMapView"
    />

    <PropertyList
        v-else
        :properties="filteredProperties"
        :loading="loading"
        :error="error"
        @reset-filters="resetFilters"
    />
  </div>
</template>
