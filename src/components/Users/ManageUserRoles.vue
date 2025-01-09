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
                      :value="`Move SN ${page}`"
                      v-model="selectedPermissions"
                      :disabled="!roleAssigned"
                      :checked="userPermissions.includes(`Move SN ${page}`)"
                    />
                    <label class="form-check-label" :for="`${page}-moveSN`">
                      {{ `Move SN ${page}` }}
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
          <EasyDataTable
            v-model:server-options="serverOptions"
            :server-items-length="serverItemsLength"
            :headers="headers"
            :items="tableItems"
            :loading="loading"
            :theme-color="baseColor"
            :rows-per-page="10"
            table-class-name="head-table"
            alternating
            show-index
            border-cell
            buttons-pagination
            @update:options="handleTableOptions"
          >
            <template #loading>
              <div class="loader"></div>
            </template>
            <template #empty-message>
              <p>Data not found</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

// State Management
const users = ref([])
const roles = ref([])
const selectedUser = ref(null)
const selectedRole = ref('')
const selectedPermissions = ref([])
const userPermissions = ref([])
const loading = ref(false)
const roleAssigned = ref(false)
const baseColor = ref('#dc3545')

const pages = ref(['Stocks', 'Delivery', 'Loan', 'Services', 'Spareparts', 'Firmwares'])
const actions = ref(['Create', 'Edit', 'View', 'Delete', 'Import', 'Export', 'Template'])

// Table Configuration
const headers = ref([
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Roles', value: 'roles', sortable: true },
])

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'id',
  sortType: 'asc',
})

const serverItemsLength = ref(0)

// Computed Properties
const tableItems = computed(() => {
  return users.value.map((user) => ({
    id: user.id,
    name: user.name,
    roles: getRoleForUser(user.id),
  }))
})

const permissions = computed(() => {
  const standardPermissions = pages.value.flatMap((page) =>
    actions.value.map((action) => `${action} ${page}`),
  )
  const specialPermissions = ['Move SN Stocks']
  return [...standardPermissions, ...specialPermissions]
})

// API Functions
const fetchUsers = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get('/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    users.value = response.data
    serverItemsLength.value = response.data.length
  } catch (error) {
    console.error(error)
    showToast('Failed to fetch users', 'error')
  } finally {
    loading.value = false
  }
}

const fetchRolesAndPermissions = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get('roles-permissions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    roles.value = response.data.roles
  } catch (error) {
    console.error(error)
    showToast('Failed to fetch roles and permissions', 'error')
  }
}

const loadUserPermissions = async () => {
  if (!selectedUser.value) return

  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`users/${selectedUser.value}/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })

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
      { role: selectedRole.value },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    roleAssigned.value = true
    showToast(response.data.message, 'success')
    fetchUsers()
  } catch (error) {
    console.error(error)
    showToast(error.response.data.message, 'error')
  }
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
      { permissions: selectedPermissions.value },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    showToast(response.data.message, 'success')
  } catch (error) {
    console.error(error)
    showToast(error.response.data.message, 'error')
  }
}

// Helper Functions
const getRoleForUser = (userId) => {
  const user = users.value.find((user) => user.id === userId)
  return user && user.roles.length > 0 ? user.roles.map((role) => role.name).join(', ') : 'N/A'
}

const handleRoleChange = () => {
  selectedPermissions.value = []
  roleAssigned.value = false
  assignRole()
}

const handleTableOptions = async (options) => {
  serverOptions.value = options
  const { page, rowsPerPage, sortBy, sortType } = options

  // Here you would typically make an API call with pagination/sorting parameters
  // For now, we'll handle it client-side
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage

  const sortedUsers = [...users.value].sort((a, b) => {
    const modifier = sortType === 'desc' ? -1 : 1
    if (typeof a[sortBy] === 'string') {
      return modifier * a[sortBy].localeCompare(b[sortBy])
    }
    return modifier * (a[sortBy] - b[sortBy])
  })

  users.value = sortedUsers
}

// Lifecycle Hooks
onMounted(() => {
  fetchUsers()
  fetchRolesAndPermissions()
})

// Watchers
watch(selectedUser, () => {
  if (selectedUser.value) {
    loadUserPermissions()
  }
})
</script>
