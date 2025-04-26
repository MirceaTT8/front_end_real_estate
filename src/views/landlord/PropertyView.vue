<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchPropertiesByUserId } from '@/services/propertyService.js'
import PropertyFilters from '@/components/property/PropertyFilters.vue'
import PropertyList from "@/components/property/PropertyList.vue"
import PropertyMap from "@/components/property/PropertyMap.vue"
import PropertyViewToggle from "@/components/property/PropertyViewToggle.vue"
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
  statuses: ['Available', 'Rented', 'Maintenance']
}

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesLocation = !filters.value.location ||
        property.address.toLowerCase().includes(filters.value.location.toLowerCase())

    // Convert filter value to uppercase for comparison
    const filterType = filters.value.type?.toUpperCase() || ''
    const matchesType = !filters.value.type ||
        property.type === filterType

    // Convert filter value to uppercase for comparison
    const filterStatus = filters.value.status?.toUpperCase() || ''
    const matchesStatus = !filters.value.status ||
        property.status === filterStatus

    return matchesLocation && matchesType && matchesStatus
  })
})

const onFiltersUpdate = (newFilters) => {
  filters.value = { ...newFilters }
}

const availableTypes = computed(() => {
  // Get all unique property types from backend (UPPERCASE)
  const backendTypes = new Set(properties.value.map(p => p.type))

  // Return filter options that exist in backend data
  return filterOptions.types.filter(frontendType =>
      backendTypes.has(frontendType.toUpperCase())
  )
})

const availableStatuses = computed(() => {
  const backendStatuses = new Set(properties.value.map(p => p.status))
  return filterOptions.statuses.filter(frontendStatus =>
      backendStatuses.has(frontendStatus.toUpperCase())
  )
})


onMounted(async () => {
  try {
    properties.value = await fetchPropertiesByUserId(1)
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
        :filterOptions="{
          ...filterOptions,
          availableTypes: availableTypes,
          availableStatuses: availableStatuses,
        }"
        @update:filters="onFiltersUpdate"
    />

    <PropertyMap
        v-if="showMapView"
        :properties="filteredProperties"
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