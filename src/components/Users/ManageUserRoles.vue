<template>
  <div>
    <h2>Manage User Roles and Permissions</h2>

    <div>
      <label>Select User:</label>
      <select v-model="selectedUser" style="width: 10rem">
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
    </div>

    <div>
      <label>Assign Role:</label>
      <select v-model="selectedRole">
        <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
      </select>
      <button @click="assignRole">Assign Role</button>
    </div>

    <div>
      <label>Assign Permissions:</label>
      <div v-for="permission in permissions" :key="permission.id">
        <input type="checkbox" :value="permission.name" v-model="selectedPermissions" />
        {{ permission.name }}
      </div>
      <button @click="assignPermissions">Assign Permissions</button>
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'
const token = localStorage.getItem('token')

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
    }
  },
  mounted() {
    this.fetchUsers()
    this.fetchRolesAndPermissions()
  },
  methods: {
    // Fetch semua user
    async fetchUsers() {
      try {
        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.users = response.data
      } catch (error) {
        console.error(error)
      }
    },
    // Fetch roles dan permissions dari API
    async fetchRolesAndPermissions() {
      try {
        const response = await axios.get('roles-permissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.roles = response.data.roles
        this.permissions = response.data.permissions
      } catch (error) {
        console.error(error)
      }
    },
    // Assign role ke user
    async assignRole() {
      try {
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
      } catch (error) {
        console.error(error)
        this.message = error.response?.data?.message || 'An error occurred'
      }
    },
    // Assign permissions ke user
    async assignPermissions() {
      try {
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
        this.message = error.response.data.message
      }
    },
  },
}
</script>
