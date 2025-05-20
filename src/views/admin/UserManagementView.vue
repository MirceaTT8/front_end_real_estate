<script setup>
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  userStore.loadUsers()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div class="flex items-center gap-3">
        <span class="text-4xl">👥</span>
        <h1 class="text-3xl font-semibold text-gray-800">User Management</h1>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
            type="text"
            v-model="userStore.searchQuery"
            placeholder="Search users..."
            class="px-4 py-2 w-full sm:w-64 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
            @click="showUserDialog = true"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <i class="fas fa-user-plus"></i> Add User
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="userStore.loading" class="text-center py-8 text-gray-500">
      Loading users...
    </div>

    <!-- User Table -->
    <div v-else class="bg-white shadow-xl rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <input type="checkbox" @change="toggleSelectAll" class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500">
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
          <tr
              v-for="user in userStore.filteredUsers"
              :key="user.userId"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <input
                  type="checkbox"
                  :checked="userStore.selectedUsers.has(user.userId)"
                  @change="toggleUserSelection(user.userId, $event)"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              >
            </td>
            <td class="px-6 py-4 text-gray-500">{{ user.userId }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ user.lastName }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ user.firstName }}</td>
            <td class="px-6 py-4 text-blue-600 hover:text-blue-800">
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </td>
            <td class="px-6 py-4">
                <span
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    :title="user.isActive ? 'Click to deactivate' : 'Click to activate'"
                    @click="toggleUserStatus(user)"
                    style="cursor: pointer;"
                >
                  {{ user.isActive ? 'ACTIVE' : 'INACTIVE' }}
                </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-3">
                <button
                    @click="toggleUserStatus(user)"
                    class="text-sm text-yellow-600 hover:text-yellow-800"
                >
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                    @click="confirmDelete(user.userId)"
                    class="text-sm text-red-600 hover:text-red-800"
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
      <div v-if="userStore.selectedUsers.size > 0" class="bg-gray-50 px-6 py-4 flex flex-wrap gap-3 border-t border-gray-200">
        <button
            @click="bulkToggleStatus(true)"
            class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          Activate Selected
        </button>
        <button
            @click="bulkToggleStatus(false)"
            class="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Deactivate Selected
        </button>
        <button
            @click="userStore.approveSelected"
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Approve Selected
        </button>
        <button
            @click="userStore.suspendSelected"
            class="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
        >
          Suspend Selected
        </button>
        <button
            @click="confirmDelete([...userStore.selectedUsers][0])"
            class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Selected
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
