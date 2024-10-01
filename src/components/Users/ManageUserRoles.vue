<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Left Column: Manage User Roles and Permissions -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Manage User Roles and Permissions</h2>

          <!-- Select User -->
          <div class="mb-3">
            <label for="userSelect" class="form-label">Select User</label>
            <select id="userSelect" class="form-select shadow-none" v-model="selectedUser">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Assign Role -->
          <div class="mb-3">
            <label for="roleSelect" class="form-label">Assign Role</label>
            <div class="input-group">
              <select
                id="roleSelect"
                class="form-select shadow-none"
                v-model="selectedRole"
                @change="clearPermissions"
              >
                <option v-for="role in roles" :key="role.id" :value="role.name">
                  {{ role.name }}
                </option>
              </select>
              <button class="btn btn-danger text-white" @click="assignRole">Assign Role</button>
            </div>
          </div>

          <!-- Assign Permissions (Disabled until a role is assigned) -->
          <div class="mb-3">
            <label class="form-label">Assign Permissions</label>
            <div class="d-flex flex-wrap">
              <div v-for="page in pages" :key="page" class="mb-3">
                <h5>{{ page }}</h5>
                <div class="ms-3">
                  <div class="form-check" v-for="action in actions" :key="action">
                    <input
                      class="form-check-input shadow-none"
                      type="checkbox"
                      :id="`${page}-${action}`"
                      :value="`${action} ${page}`"
                      v-model="selectedPermissions"
                      :disabled="!roleAssigned"
                    />
                    <label class="form-check-label" :for="`${page}-${action}`">
                      {{ `${action} ${page}` }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="btn btn-danger text-white"
            @click="assignPermissions"
            :disabled="!roleAssigned"
          >
            Assign Permissions
          </button>

          <!-- Display Message -->
          <div v-if="message" class="alert alert-success mt-3">
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Right Column: Users Table -->
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Users</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roles</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ getRoleForUser(user.id) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1">
              Previous
            </button>
            <button
              class="btn btn-secondary"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const users = ref([])
    const roles = ref([])
    const selectedUser = ref(null)
    const selectedRole = ref('')
    const selectedPermissions = ref([])
    const message = ref('')
    const roleAssigned = ref(false)
    const currentPage = ref(1)
    const pageSize = 5
    const pages = ref(['Stocks', 'Delivery', 'Loan', 'Services', 'Spareparts', 'Firmwares'])
    const actions = ref(['create', 'edit', 'view', 'delete'])

    const permissions = computed(() => {
      return pages.value.flatMap((page) => actions.value.map((action) => `${action} ${page}`))
    })

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Token not found')
        }

        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        users.value = response.data
      } catch (error) {
        console.error(error)
        message.value = 'Failed to fetch users'
      }
    }

    const fetchRolesAndPermissions = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Token not found')
        }

        const response = await axios.get('roles-permissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        roles.value = response.data.roles
        permissions.value = response.data.permissions
      } catch (error) {
        console.error(error)
        message.value = 'Failed to fetch roles and permissions'
      }
    }

    const assignRole = async () => {
      if (!selectedUser.value || !selectedRole.value) {
        message.value = 'Please select both a user and a role'
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `users/${selectedUser.value}/assign-role`,
          {
            role: selectedRole.value,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        message.value = response.data.message
        roleAssigned.value = true
        fetchUsers()
      } catch (error) {
        console.error(error)
        message.value =
          error.response?.data?.message || 'An error occurred while assigning the role'
      }
    }

    const assignPermissions = async () => {
      if (!selectedUser.value || selectedPermissions.value.length === 0) {
        message.value = 'Please select a user and at least one permission'
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `users/${selectedUser.value}/assign-permissions`,
          {
            permissions: selectedPermissions.value,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        message.value = response.data.message
      } catch (error) {
        console.error(error)
        message.value =
          error.response?.data?.message || 'An error occurred while assigning permissions'
      }
    }

    const getRoleForUser = (userId) => {
      const user = users.value.find((user) => user.id === userId)
      return user && user.roles.length > 0 ? user.roles.map((role) => role.name).join(', ') : 'N/A'
    }

    const clearPermissions = () => {
      selectedPermissions.value = []
      roleAssigned.value = false
    }

    const totalPages = computed(() => Math.ceil(users.value.length / pageSize))

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return users.value.slice(start, end)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    onMounted(() => {
      fetchUsers()
      fetchRolesAndPermissions()
    })

    return {
      users,
      roles,
      permissions,
      selectedUser,
      selectedRole,
      selectedPermissions,
      message,
      roleAssigned,
      currentPage,
      totalPages,
      paginatedUsers,
      assignRole,
      assignPermissions,
      getRoleForUser,
      clearPermissions,
      nextPage,
      prevPage,
      pages,
      actions,
    }
  },
}
</script>
