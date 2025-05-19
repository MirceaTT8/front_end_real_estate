import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllLogs } from '@/services/logsService'
import { usePagination } from "@/composables/usePagination.js";

export const useLogStore = defineStore('logStore', () => {
    const logs = ref([])
    const loading = ref(false)
    const error = ref(null)

    const filters = ref({
        actionType: '',
        entityType: '',
        userId: '',
        dateRange: 'all'
    })

    const sortField = ref('createdAt')
    const sortDirection = ref('desc')

    const fetchLogs = async () => {
        try {
            loading.value = true
            logs.value = await fetchAllLogs()
        } catch (err) {
            error.value = 'Failed to fetch logs'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const uniqueActionTypes = computed(() => {
        const actions = new Set()
        logs.value.forEach(log => actions.add(log.actionType))
        return Array.from(actions).sort()
    })

    const uniqueEntityTypes = computed(() => {
        const entities = new Set()
        logs.value.forEach(log => entities.add(log.entityType))
        return Array.from(entities).sort()
    })

    const uniqueUserIds = computed(() => {
        const users = new Set()
        logs.value.forEach(log => users.add(log.userId))
        return Array.from(users).sort((a, b) => a - b)
    })

    const filteredLogs = computed(() => {
        return logs.value.filter(log => {
            if (filters.value.actionType && log.actionType !== filters.value.actionType) return false
            if (filters.value.entityType && log.entityType !== filters.value.entityType) return false
            if (filters.value.userId && log.userId !== parseInt(filters.value.userId)) return false

            const logDate = new Date(log.createdAt)
            const now = new Date()

            switch (filters.value.dateRange) {
                case 'today':
                    return logDate.toDateString() === now.toDateString()
                case 'week': {
                    const startOfWeek = new Date(now)
                    startOfWeek.setDate(now.getDate() - now.getDay())
                    startOfWeek.setHours(0, 0, 0, 0)
                    return logDate >= startOfWeek
                }
                case 'month': {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                    return logDate >= startOfMonth
                }
                default:
                    return true
            }
        })
    })

    const sortedFilteredLogs = computed(() => {
        return [...filteredLogs.value].sort((a, b) => {
            const fieldA = a[sortField.value]
            const fieldB = b[sortField.value]
            if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
            if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
            return 0
        })
    })


    const { currentPage, totalPages, paginatedItems: paginatedLogs, resetPagination } =
        usePagination(sortedFilteredLogs, 20)

    const sortBy = (field) => {
        if (sortField.value === field) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortField.value = field
            sortDirection.value = 'asc'
        }
    }

    const applyFilters = () => {
        resetPagination()
    }

    const resetFilters = () => {
        filters.value = {
            actionType: '',
            entityType: '',
            userId: '',
            dateRange: 'all'
        }
        resetPagination()
    }

    return {
        logs,
        loading,
        error,
        filters,
        currentPage,
        fetchLogs,
        uniqueActionTypes,
        uniqueEntityTypes,
        uniqueUserIds,
        paginatedLogs,
        totalPages,
        sortBy,
        applyFilters,
        resetFilters
    }
})
