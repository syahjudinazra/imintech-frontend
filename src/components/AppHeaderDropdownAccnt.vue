<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem>
        <div class="d-flex align-items-center">
          <span class="online-indicator me-2"></span>
          {{ user.name }}
        </div>
      </CDropdownItem>
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Settings
      </CDropdownHeader>
      <CDropdownItem><CIcon icon="cil-user" /> Profile</CDropdownItem>
      <CDropdownItem><CIcon icon="cil-settings" /> Settings</CDropdownItem>
      <CDropdownItem @click="handleLogout"><CIcon icon="cil-lock-locked" /> Logout</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import avatar from '../assets/images/avatars/iminavatars.png'

const router = useRouter()
const user = ref({})

const fetchUsers = async () => {
  try {
    const response = await axios.get('/user')
    user.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const handleLogout = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('users')
  user.value = {}
  router.push('/pages/login')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.online-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #28a745;
  border-radius: 50%;
}

.me-2 {
  margin-right: 0.5rem;
}
</style>
