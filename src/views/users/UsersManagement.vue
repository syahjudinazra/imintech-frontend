<template>
  <div>
    <ManageUserRoles v-if="userRole === 'superadmin'" />
    <p v-else-if="userRole === ''">Loading...</p>
    <StatusPage v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ManageUserRoles from '../../components/Users/ManageUserRoles.vue'
import StatusPage from '../../components/StatusPage/404Page.vue'

const userRole = ref('')

async function fetchUserRole() {
  try {
    const response = await axios.get('user')
    const roles = response.data.roles || []
    userRole.value = roles.some((role) => role.name === 'superadmin') ? 'superadmin' : 'user'
  } catch (error) {
    console.error('Error fetching user roles:', error)
  }
}

onMounted(() => {
  fetchUserRole()
})
</script>
