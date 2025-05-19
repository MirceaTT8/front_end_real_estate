<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useLandlordPropertyStore } from '@/stores/propertyStore.js'

import PropertyFilters from '@/components/landlord/property/PropertyFilters.vue'
import PropertyList from '@/components/landlord/property/PropertyList.vue'
import PropertyMap from '@/components/landlord/property/PropertyMap.vue'
import PropertyViewToggle from '@/components/landlord/property/PropertyViewToggle.vue'

const store = useLandlordPropertyStore()
const showMapView = ref(false)
const filters = ref({ location: '', type: '', status: '' })

const filterOptions = {
  types: ['Apartment', 'House', 'Commercial', 'Land'],
  statuses: ['Available', 'Rented', 'Maintenance']
}

const filteredProperties = computed(() => {
  return store.properties.filter(property => {
    const matchesLocation = !filters.value.location ||
        property.address.toLowerCase().includes(filters.value.location.toLowerCase())

    const matchesType = !filters.value.type ||
        property.type === filters.value.type.toUpperCase()

    const matchesStatus = !filters.value.status ||
        property.status === filters.value.status.toUpperCase()

    return matchesLocation && matchesType && matchesStatus
  })
})

const resetFilters = () => {
  filters.value = { location: '', type: '', status: '' }
}

const isInternalUpdate = ref(false)
const onFiltersUpdate = (newFilters) => {
  if (!isInternalUpdate.value) {
    filters.value = { ...newFilters }
  }
}

const availableTypes = computed(() => {
  const backendTypes = new Set(store.properties.map(p => p.type))
  return filterOptions.types.filter(frontendType =>
      backendTypes.has(frontendType.toUpperCase())
  )
})

const availableStatuses = computed(() => {
  const filteredByType = store.properties.filter(property => {
    if (!filters.value.type) return true
    return property.type === filters.value.type.toUpperCase()
  })

  const backendStatuses = new Set(filteredByType.map(p => p.status))
  return filterOptions.statuses.filter(frontendStatus =>
      backendStatuses.has(frontendStatus.toUpperCase())
  )
})

watch(() => filters.value.type, (newType, oldType) => {
  if (newType !== oldType) {
    isInternalUpdate.value = true
    filters.value.status = ''
    nextTick(() => {
      isInternalUpdate.value = false
    })
  }
})

onMounted(async () => {
  await store.loadProperties()
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
        availableStatuses: availableStatuses
      }"
        @update:filters="onFiltersUpdate"
        @reset="resetFilters"
    />

    <PropertyMap
        v-if="showMapView"
        :properties="filteredProperties"
    />

    <PropertyList
        v-else
        :properties="filteredProperties"
        :loading="store.loading"
        :error="store.error"
    />
  </div>
</template>
