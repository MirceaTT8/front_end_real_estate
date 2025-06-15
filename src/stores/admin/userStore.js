import { defineStore } from 'pinia'
import { useBaseAdminStore } from '@/composables/useBaseAdminStore.js'
import {
    fetchAllUsers,
    createUser,
    deleteUser,
    approveUsers,
    suspendUsers,
    updateUserRole,
    activateUser,
    deactivateUser
} from '@/services/userService.js'

export const useUserStore = defineStore('userStore', () => {
    const baseStore = useBaseAdminStore({
        entityName: 'users',
        defaultSortField: 'createdAt',
        defaultSortDirection: 'desc',
        pageSize: 10,
        searchFields: ['firstName', 'lastName', 'email'],
        idField: 'userId'
    })

    const roles = ['ADMIN', 'LANDLORD', 'TENANT']
    const statuses = ['ACTIVE', 'PENDING', 'SUSPENDED']

    const loadUsers = () => baseStore.fetchItems(fetchAllUsers)

    const addUser = (userData) => baseStore.executeAction(async (data) => {
        await createUser(data)
        await loadUsers()
    }, userData)

    const removeUser = (userId) => baseStore.executeAction(async (id) => {
        await deleteUser(id)
        await loadUsers()
    }, userId)

    const approveSelected = () => baseStore.executeAction(async () => {
        await approveUsers([...baseStore.selectedItems])
        await loadUsers()
        baseStore.clearSelection()
    })

    const suspendSelected = () => baseStore.executeAction(async () => {
        await suspendUsers([...baseStore.selectedItems])
        await loadUsers()
        baseStore.clearSelection()
    })

    const updateRole = (userId, newRole) => baseStore.executeAction(async (id, role) => {
        await updateUserRole(id, role)
        await loadUsers()
    }, userId, newRole)

    const activateUserAction = (userId) => baseStore.executeAction(async (id) => {
        await activateUser(id)
        await loadUsers()
    }, userId)

    const deactivateUserAction = (userId) => baseStore.executeAction(async (id) => {
        await deactivateUser(id)
        await loadUsers()
    }, userId)

    return {
        ...baseStore,
        roles,
        statuses,
        loadUsers,
        addUser,
        removeUser,
        approveSelected,
        suspendSelected,
        updateRole,
        activateUserAction,
        deactivateUserAction,
        users: baseStore.items,
        selectedUsers: baseStore.selectedItems,
        filteredUsers: baseStore.filteredItems
    }
})