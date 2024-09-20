<template>
  <div>
    <ManageUserRoles v-if="userRole === 'superadmin'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ManageUserRoles from '../../components/Users/ManageUserRoles.vue'

const userRole = ref('')
const token = localStorage.getItem('token')

async function fetchUserRole() {
  try {
    const response = await axios.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const roles = response.data.roles || []
    userRole.value = roles.some((role) => role.name === 'superadmin') ? 'superadmin' : ''
  } catch (error) {
    console.error('Error fetching user roles:', error)
  }
}

onMounted(() => {
  fetchUserRole()
})
</script>
