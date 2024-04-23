<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard>
              <CCardBody class="p-4">
                <CForm @submit.prevent="login">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      class="shadow-none"
                      v-model="name"
                      type="text"
                      placeholder="Name"
                      autocomplete="name"
                      required
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      class="shadow-none"
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="danger" class="px-4 text-white" type="submit">Login</CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white">
              <CCardBody class="card-login text-center">
                <img :src="bgLogin" class="bg-login" alt="D4-Pro" />
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import bgLogin from '@/assets/images/D4-Pro.jpg'

export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      password: '',
      bgLogin,
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('login', {
          name: this.name,
          password: this.password,
        })
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        console.log('Login successful:', response.data)
        this.showNotification('success', response.data.message)
        this.authenticated = true
        this.$router.push({ name: 'Dashboard' })
      } catch (error) {
        console.error('Login failed:', error)
        this.showNotification('error', error.response.data.message)
        this.clearInput()
      }
    },

    showNotification(type, message) {
      return new Promise((resolve) => {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
        toast
          .fire({
            icon: type,
            title: message,
          })
          .then(() => {
            resolve()
          })
      })
    },
    clearInput() {
      this.name = ''
      this.password = ''
    },
  },
}
</script>

<style scoped>
.bg-login {
  height: -webkit-fill-available;
  width: -webkit-fill-available;
}

.card-login {
  padding: 0 !important;
}
</style>
