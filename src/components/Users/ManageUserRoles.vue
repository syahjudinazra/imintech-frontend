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
            <div class="form-check" v-for="permission in permissions" :key="permission.id">
              <input
                class="form-check-input shadow-none"
                type="checkbox"
                :value="permission.name"
                v-model="selectedPermissions"
                :disabled="!roleAssigned"
              />
              <label class="form-check-label">
                {{ permission.name }}
              </label>
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
          <div v-if="message" class="alert alert-info mt-3">
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
              <tr v-for="user in users" :key="user.id">
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
import axios from 'axios'

export default {
  data() {
    return {
      users: [],
      roles: [],
      permissions: [],
      selectedUser: null,
      selectedRole: '',
      selectedPermissions: [],
      message: '',
      roleAssigned: false,
      currentPage: 1,
      pageSize: 5,
    }
  },
  mounted() {
    this.fetchUsers()
    this.fetchRolesAndPermissions()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.pageSize)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.users.slice(start, end)
    },
  },
  methods: {
    // Fetch all users
    async fetchUsers() {
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
        this.users = response.data
      } catch (error) {
        console.error(error)
        this.message = 'Failed to fetch users'
      }
    },
    // Fetch roles and permissions from API
    async fetchRolesAndPermissions() {
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
        this.roles = response.data.roles
        this.permissions = response.data.permissions
      } catch (error) {
        console.error(error)
        this.message = 'Failed to fetch roles and permissions'
      }
    },
    // Assign role to user
    async assignRole() {
      if (!this.selectedUser || !this.selectedRole) {
        this.message = 'Please select both a user and a role'
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `users/${this.selectedUser}/assign-role`,
          {
            role: this.selectedRole,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        this.message = response.data.message
        this.roleAssigned = true // Set flag to true after assigning role
        this.fetchUsers() // Refresh user list after role assignment
      } catch (error) {
        console.error(error)
        this.message = error.response?.data?.message || 'An error occurred while assigning the role'
      }
    },
    // Assign permissions to user
    async assignPermissions() {
      if (!this.selectedUser || this.selectedPermissions.length === 0) {
        this.message = 'Please select a user and at least one permission'
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `users/${this.selectedUser}/assign-permissions`,
          {
            permissions: this.selectedPermissions,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        this.message = response.data.message
      } catch (error) {
        console.error(error)
        this.message =
          error.response?.data?.message || 'An error occurred while assigning permissions'
      }
    },
    // Get role for a specific user
    getRoleForUser(userId) {
      const user = this.users.find((user) => user.id === userId)
      return user && user.roles.length > 0 ? user.roles.map((role) => role.name).join(', ') : 'N/A'
    },
    // Clear selected permissions when role changes
    clearPermissions() {
      this.selectedPermissions = []
      this.roleAssigned = false
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
  },
}
</script>
