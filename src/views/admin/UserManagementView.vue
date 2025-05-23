<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: 'TempPassword123!'
})
const showUserDialog = ref(false)
const statusFilter = ref('ALL')

const resetNewUser = () => {
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: 'TempPassword123!'
  }
}

const saveNewUser = async () => {
  try {
    await userStore.addUser(newUser.value)
    alert('User created successfully')
    showUserDialog.value = false
    resetNewUser()
  } catch (error) {
    alert('Failed to create user: ' + error.message)
  }
}

const toggleUserSelection = (userId, event) => {
  if (event.target.checked) {
    userStore.selectedUsers.add(userId)
  } else {
    userStore.selectedUsers.delete(userId)
  }
}

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    userStore.users.forEach(user => userStore.selectedUsers.add(user.userId))
  } else {
    userStore.selectedUsers.clear()
  }
}

const confirmDelete = (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    deleteUserById(userId)
  }
}

const deleteUserById = async (userId) => {
  try {
    await userStore.removeUser(userId)
    alert('User deleted successfully')
  } catch (error) {
    alert('Failed to delete user: ' + error.message)
  }
}

const toggleUserStatus = async (user) => {
  const action = user.isActive ? 'deactivate' : 'activate'
  const confirmMessage = `Are you sure you want to ${action} user ${user.firstName} ${user.lastName}?`

  if (confirm(confirmMessage)) {
    try {
      await userStore.toggleStatus(user)
      alert(`User ${action}d successfully`)
    } catch (error) {
      alert(`Failed to ${action} user: ${error.message}`)
    }
  }
}

const bulkToggleStatus = async (activate) => {
  const action = activate ? 'activate' : 'deactivate'
  const confirmMessage = `Are you sure you want to ${action} ${userStore.selectedUsers.size} selected user(s)?`

  if (userStore.selectedUsers.size === 0) {
    alert('Please select at least one user')
    return
  }

  if (confirm(confirmMessage)) {
    try {
      await userStore.bulkToggleStatus(activate)
      alert(`Successfully ${action}d users`)
    } catch (error) {
      alert(`Failed to ${action} users: ${error.message}`)
    }
  }
}

// Computed property for filtered users based on both status and search
const filteredUsers = computed(() => {
  return userStore.filteredUsers.filter(user => {
    // Filter by status
    if (statusFilter.value === 'ACTIVE' && !user.isActive) return false
    if (statusFilter.value === 'INACTIVE' && user.isActive) return false
    return true
  })
})

onMounted(() => {
  userStore.loadUsers()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
      <div class="px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">User Management</h1>
              <p class="text-purple-100 mt-1">Manage your system users and permissions</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
                @click="showUserDialog = true"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-700 text-sm font-medium rounded-xl hover:bg-purple-50 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">Find Users</h2>
        <p class="text-sm text-gray-500">Search and filter system users</p>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <!-- Status Filter -->
          <div class="space-y-2">
            <label for="status" class="block text-sm font-medium text-gray-700">User Status</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <select
                  id="status"
                  v-model="statusFilter"
                  class="block w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none"
              >
                <option value="ALL">All Users</option>
                <option value="ACTIVE">Active Users</option>
                <option value="INACTIVE">Inactive Users</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div class="sm:col-span-2 space-y-2">
            <label for="search" class="block text-sm font-medium text-gray-700">Search Users</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                  id="search"
                  v-model="userStore.searchQuery"
                  type="text"
                  placeholder="Search by name, email or ID"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-indigo-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Total Users</h3>
            <p class="font-bold text-xl text-gray-800">{{ userStore.users.length || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Active Users</h3>
            <p class="font-bold text-xl text-gray-800">{{ userStore.users.filter(u => u.isActive).length || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-red-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Inactive Users</h3>
            <p class="font-bold text-xl text-gray-800">{{ userStore.users.filter(u => !u.isActive).length || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Selected</h3>
            <p class="font-bold text-xl text-gray-800">{{ userStore.selectedUsers.size || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="userStore.loading" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg class="animate-spin h-10 w-10 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-lg">Loading users...</p>
      </div>
    </div>

    <!-- User Table -->
    <div v-else class="bg-white shadow-xl rounded-xl overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">User Directory</h2>
        <p class="text-sm text-gray-500">{{ filteredUsers.length }} users found</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left">
              <div class="flex items-center">
                <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                >
                <span class="ml-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
          <tr
              v-for="user in filteredUsers"
              :key="user.userId"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <input
                  type="checkbox"
                  :checked="userStore.selectedUsers.has(user.userId)"
                  @change="toggleUserSelection(user.userId, $event)"
                  class="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">{{ user.userId }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-700 font-medium">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-gray-500 text-xs">{{ user.role || 'User' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <a :href="`mailto:${user.email}`" class="text-purple-600 hover:text-purple-900 hover:underline">
                {{ user.email }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                    :class="user.isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'"
                    :title="user.isActive ? 'Click to deactivate' : 'Click to activate'"
                    @click="toggleUserStatus(user)"
                    style="cursor: pointer;"
                >
                  <span class="w-2 h-2 rounded-full mr-1.5" :class="user.isActive ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ user.isActive ? 'ACTIVE' : 'INACTIVE' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                    @click="toggleUserStatus(user)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                    @click="confirmDelete(user.userId)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Actions -->
      <div v-if="userStore.selectedUsers.size > 0" class="bg-gray-50 px-6 py-4 flex flex-wrap gap-3 border-t border-gray-200">
        <div class="flex items-center mr-2">
          <span class="text-sm font-medium text-gray-700">{{ userStore.selectedUsers.size }} users selected</span>
        </div>
        <button
            @click="bulkToggleStatus(true)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Activate
        </button>
        <button
            @click="bulkToggleStatus(false)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          Deactivate
        </button>
        <button
            @click="userStore.approveSelected"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Approve
        </button>
        <button
            @click="userStore.suspendSelected"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
          Suspend
        </button>
        <button
            @click="confirmDelete([...userStore.selectedUsers][0])"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showUserDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Add New User</h2>
          <button
              @click="showUserDialog = false"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
                v-model="newUser.firstName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter first name"
                required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
                v-model="newUser.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter last name"
                required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                v-model="newUser.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter email address"
                required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
                v-model="newUser.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
            >
              <option value="">Select a role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  A temporary password will be generated and sent to the user's email address.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
              @click="showUserDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>
          <button
              @click="saveNewUser"
              :disabled="!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>