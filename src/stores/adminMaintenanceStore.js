import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllMaintenanceRequests } from '@/services/maintenanceService.js'
import { usePagination} from "@/composables/usePagination.js";

export const useMaintenanceAdminStore = defineStore('maintenanceAdmin', () => {
    const loading = ref(false)
    const requests = ref([])

    const filters = ref({
        status: 'ALL',
        query: ''
    })

    const sortField = ref('createdAt')
    const sortDirection = ref('desc')

    const fetchRequests = async () => {
        loading.value = true
        try {
            requests.value = await fetchAllMaintenanceRequests()
        } catch (error) {
            console.error('Failed to load maintenance requests:', error)
        } finally {
            loading.value = false
        }
    }

    const setSort = (field) => {
        if (sortField.value === field) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortField.value = field
            sortDirection.value = 'asc'
        }
    }

    const filteredRequests = computed(() => {
        const filtered = requests.value.filter(req => {
            const matchesStatus = filters.value.status === 'ALL' || req.status === filters.value.status
            const matchesQuery =
                filters.value.query === '' ||
                req.leaseId.toString().includes(filters.value.query) ||
                req.requestId.toString().includes(filters.value.query)
            return matchesStatus && matchesQuery
        })

        return filtered.sort((a, b) => {
            const aVal = a[sortField.value]
            const bVal = b[sortField.value]
            if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
            return 0
        })
    })

    const { currentPage, totalPages, paginatedItems: paginatedRequests, resetPagination } =
        usePagination(filteredRequests, 10)


    return {
        loading,
        requests,
        filters,
        sortField,
        sortDirection,
        filteredRequests,
        paginatedRequests,
        currentPage,
        totalPages,
        fetchRequests,
        setSort,
        resetPagination
    }

})
