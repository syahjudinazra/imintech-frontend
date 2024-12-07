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
            <v-select
              v-model="selectedUser"
              :options="users"
              :reduce="(user) => user.id"
              label="name"
              :clearable="false"
              placeholder="Select a user"
              @update:modelValue="loadUserPermissions"
            />
          </div>

          <!-- Assign Role -->
          <div class="mb-3">
            <label for="roleSelect" class="form-label">Assign Role</label>
            <v-select
              v-model="selectedRole"
              :options="roles"
              :reduce="(role) => role.name"
              label="name"
              :clearable="false"
              placeholder="Select a role"
              @update:modelValue="handleRoleChange"
            />
            <small class="text-secondary"
              >The role will be generated automatically when you select the role</small
            >
          </div>

          <!-- Assign Permissions -->
          <div class="mb-3">
            <label class="form-label">Assign Permissions</label>
            <div class="d-flex flex-wrap">
              <div v-for="page in pages" :key="page" class="mb-3">
                <h5>{{ page }}</h5>
                <div class="ms-3">
                  <!-- Standard permissions -->
                  <div class="form-check" v-for="action in actions" :key="action">
                    <input
                      class="form-check-input shadow-none"
                      type="checkbox"
                      :id="`${page}-${action}`"
                      :value="`${action} ${page}`"
                      v-model="selectedPermissions"
                      :disabled="!roleAssigned"
                      :checked="userPermissions.includes(`${action} ${page}`)"
                    />
                    <label class="form-check-label" :for="`${page}-${action}`">
                      {{ `${action} ${page}` }}
                    </label>
                  </div>

                  <!-- Special "move SN" permission only for Stocks page -->
                  <div class="form-check" v-if="page === 'Stocks'">
                    <input
                      class="form-check-input shadow-none"
                      type="checkbox"
                      :id="`${page}-moveSN`"
                      :value="`move SN ${page}`"
                      v-model="selectedPermissions"
                      :disabled="!roleAssigned"
                      :checked="userPermissions.includes(`move SN ${page}`)"
                    />
                    <label class="form-check-label" :for="`${page}-moveSN`">
                      {{ `move SN ${page}` }}
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const users = ref([])
const roles = ref([])
const selectedUser = ref(null)
const selectedRole = ref('')
const selectedPermissions = ref([])
const userPermissions = ref([])
const message = ref('')
const roleAssigned = ref(false)
const currentPage = ref(1)
const pageSize = 5
const pages = ref(['Stocks', 'Delivery', 'Loan', 'Services', 'Spareparts', 'Firmwares'])
const actions = ref(['create', 'edit', 'view', 'delete', 'import', 'export', 'template'])

// Updated permissions computed property to include "move SN" for Stocks
const permissions = computed(() => {
  const standardPermissions = pages.value.flatMap((page) =>
    actions.value.map((action) => `${action} ${page}`),
  )

  // Add "move SN" permission only for Stocks
  const specialPermissions = ['move SN Stocks']

  return [...standardPermissions, ...specialPermissions]
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

const loadUserPermissions = async () => {
  if (!selectedUser.value) return

  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`users/${selectedUser.value}/permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Reset state when loading new user
    userPermissions.value = response.data.permissions
    selectedRole.value = response.data.role || ''
    roleAssigned.value = !!selectedRole.value
    selectedPermissions.value = userPermissions.value
  } catch (error) {
    console.error(error)
    showToast('Failed to load user permissions', 'error')
  }
}

const assignRole = async () => {
  if (!selectedUser.value || !selectedRole.value) {
    showToast('Please select both a user and a role', 'error')
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
    roleAssigned.value = true
    showToast(response.data.message, 'success')
    fetchUsers()
  } catch (error) {
    console.error(error)
    showToast(error.response.data.message, 'error')
  }
}

const handleRoleChange = () => {
  clearPermissions()
  assignRole()
}

const assignPermissions = async () => {
  if (!selectedUser.value || selectedPermissions.value.length === 0) {
    showToast('Please select a user and at least one permission', 'error')
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
    showToast(response.data.message, 'success')
  } catch (error) {
    console.error(error)
    showToast(error.response.data.message, 'error')
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

watch(selectedUser, () => {
  if (selectedUser.value) {
    loadUserPermissions()
  }
})
</script>
