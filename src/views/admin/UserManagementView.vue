<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  fetchAllUsers,
  createUser,
  deleteUser,
  approveUsers,
  suspendUsers,
  updateUserRole,
  activateUser as apiActivateUser,
  deactivateUser as apiDeactivateUser
} from '@/services/userService'

// Data
const users = ref([])
const selectedUsers = ref(new Set())
const loading = ref(false)
const showUserDialog = ref(false)
const searchQuery = ref('')

const roles = ['ADMIN', 'LANDLORD', 'TENANT']
const statuses = ['ACTIVE', 'PENDING', 'SUSPENDED']

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: 'TempPassword123!'
})

// Computed
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  ))
})

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await fetchAllUsers()
  } catch (error) {
    alert('Failed to load users: ' + error.message)
  } finally {
    loading.value = false
  }
}

const saveNewUser = async () => {
  try {
    await createUser(newUser.value)
    alert('User created successfully')
    showUserDialog.value = false
    loadUsers()
    resetNewUser()
  } catch (error) {
    alert('Failed to create user: ' + error.message)
  }
}

const resetNewUser = () => {
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: 'TempPassword123!'
  }
}

const toggleUserSelection = (userId, event) => {
  if (event.target.checked) {
    selectedUsers.value.add(userId)
  } else {
    selectedUsers.value.delete(userId)
  }
}

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    users.value.forEach(user => selectedUsers.value.add(user.userId))
  } else {
    selectedUsers.value.clear()
  }
}

const approveSelectedUsers = async () => {
  try {
    await approveUsers([...selectedUsers.value])
    alert('Users approved successfully')
    loadUsers()
    selectedUsers.value.clear()
  } catch (error) {
    alert('Failed to approve users: ' + error.message)
  }
}

const suspendSelectedUsers = async () => {
  try {
    await suspendUsers([...selectedUsers.value])
    alert('Users suspended successfully')
    loadUsers()
    selectedUsers.value.clear()
  } catch (error) {
    alert('Failed to suspend users: ' + error.message)
  }
}

const onRoleChange = async (userId, newRole) => {
  try {
    await updateUserRole(userId, newRole)
    alert('Role updated successfully')
  } catch (error) {
    alert('Failed to update role: ' + error.message)
    loadUsers()
  }
}

const toggleUserStatus = async (user) => {
  const action = user.isActive ? 'deactivate' : 'activate'
  const confirmMessage = `Are you sure you want to ${action} user ${user.firstName} ${user.lastName}?`

  if (confirm(confirmMessage)) {
    try {
      if (user.isActive) {
        await apiDeactivateUser(user.userId)
      } else {
        await apiActivateUser(user.userId)
      }
      alert(`User ${action}d successfully`)
      loadUsers()
    } catch (error) {
      alert(`Failed to ${action} user: ${error.message}`)
    }
  }
}

const bulkToggleStatus = async (activate) => {
  if (selectedUsers.value.size === 0) {
    alert('Please select at least one user')
    return
  }

  const action = activate ? 'activate' : 'deactivate'
  const confirmMessage = `Are you sure you want to ${action} ${selectedUsers.value.size} selected user(s)?`

  if (confirm(confirmMessage)) {
    try {
      const promises = [...selectedUsers.value].map(userId =>
          activate ? apiActivateUser(userId) : apiDeactivateUser(userId)
      )
      await Promise.all(promises)
      alert(`Successfully ${action}d ${promises.length} user(s)`)
      loadUsers()
      selectedUsers.value.clear()
    } catch (error) {
      alert(`Failed to ${action} users: ${error.message}`)
    }
  }
}

const confirmDelete = (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    deleteUserById(userId)
  }
}

const deleteUserById = async (userId) => {
  try {
    await deleteUser(userId)
    alert('User deleted successfully')
    loadUsers()
  } catch (error) {
    alert('Failed to delete user: ' + error.message)
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'SUSPENDED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">👥</span>
        <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search users..."
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
            @click="showUserDialog = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New User
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8 text-gray-500">
      Loading users...
    </div>

    <!-- User Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              First Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.userId" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                  type="checkbox"
                  :checked="selectedUsers.has(user.userId)"
                  @change="toggleUserSelection(user.userId, $event)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.userId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.firstName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                  :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer',
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
                  @click="toggleUserStatus(user)"
                  :title="user.isActive ? 'Click to deactivate' : 'Click to activate'"
              >
                {{ user.isActive ? 'ACTIVE' : 'INACTIVE' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                    @click="toggleUserStatus(user)"
                    :class="user.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'"
                >
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                    @click="confirmDelete(user.userId)"
                    class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedUsers.size > 0" class="bg-gray-50 px-6 py-3 flex flex-wrap gap-3">
        <button
            @click="bulkToggleStatus(true)"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Activate Selected
        </button>
        <button
            @click="bulkToggleStatus(false)"
            class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          Deactivate Selected
        </button>
        <button
            @click="approveSelectedUsers"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Approve Selected
        </button>
        <button
            @click="suspendSelectedUsers"
            class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Suspend Selected
        </button>
        <button
            @click="confirmDelete([...selectedUsers][0])"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete Selected
        </button>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showUserDialog" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add New User
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        v-model="newUser.firstName"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        v-model="newUser.lastName"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        v-model="newUser.email"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
                type="button"
                @click="saveNewUser"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
                type="button"
                @click="showUserDialog = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>