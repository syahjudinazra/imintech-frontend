<template>
  <div class="bg-login d-flex flex-column min-vh-100">
    <NavbarInfo />
    <div class="container flex-grow-1">
      <div class="hero-login row justify-content-center text-center">
        <!-- Adjust columns for different screen sizes -->
        <div class="col-12 col-md-6 col-lg-5 d-flex align-items-center mb-4 mb-md-0">
          <img :src="loginbg3" class="iminkitLogin w-100" alt="" />
        </div>
        <div
          class="col-12 col-md-6 col-lg-5 d-flex align-items-center justify-content-center justify-content-md-end"
        >
          <CCard class="loginForm w-100">
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
                    :type="passwordFieldType"
                    placeholder="Password"
                    autocomplete="current-password"
                    style="border-color: "
                    required
                  />
                  <CInputGroupText class="cursor-pointer" @click="togglePasswordVisibility">
                    <CIcon :icon="passwordVisibilityIcon" />
                  </CInputGroupText>
                </CInputGroup>
                <CRow>
                  <CCol :xs="6">
                    <CButton
                      color="danger"
                      class="px-4 text-white w-100"
                      type="submit"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="loader"></span>
                      <span v-else>Login</span>
                    </CButton>
                  </CCol>
                  <CCol :xs="6" class="text-right">
                    <CButton color="link" class="text-decoration-none">Forgot password?</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
    <footer class="mt-auto">
      <div class="d-flex justify-content-center">
        <p>
          <a class="text-decoration-none text-dark" href="https://imin.co.id/" target="_blank"
            >About Us |</a
          >
        </p>
        <p>
          <a
            class="text-decoration-none text-dark"
            href="https://kit.imin.sg/useprivacy"
            target="_blank"
            >&nbsp;Privacy And Terms |</a
          >
        </p>
        <p>
          <a
            class="text-decoration-none text-dark"
            href="https://imin.co.id/hubungi-imin/"
            target="_blank"
            >&nbsp;Contact Us</a
          >
        </p>
      </div>
      <div class="copyright d-flex justify-content-center">
        <p>&copy; 2024 iMin Technology Pte Ltd</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import loginbg3 from '@/assets/images/loginbg3.png'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/vue'
import { CIcon } from '@coreui/icons-vue'
import NavbarInfo from '../../components/LoginPage/NavbarInfo.vue'
export default {
  name: 'LoginPage',
  components: {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CIcon,
    NavbarInfo,
  },
  data() {
    return {
      name: '',
      password: '',
      loginbg3,
      showPassword: false,
      loading: false,
    }
  },
  computed: {
    passwordFieldType() {
      return this.showPassword ? 'text' : 'password'
    },
    passwordVisibilityIcon() {
      return this.showPassword ? 'cil-lock-locked' : 'cil-lock-unlocked'
    },
  },
  methods: {
    async login() {
      try {
        this.loading = true
        const response = await axios.post('login', {
          name: this.name,
          password: this.password,
        })
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        await this.showNotification('success', response.data.message)
        // this.authenticated = true; // Ensure this line is correct in your context
        this.$router.push({ name: 'Dashboard' })
      } catch (error) {
        console.error('Login failed:', error)
        this.showNotification('error', error.response.data.message)
        this.clearInput()
      } finally {
        this.loading = false // Stop loader
      }
    },

    async showNotification(type, message) {
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
      await toast.fire({
        icon: type,
        title: message,
      })
    },

    clearInput() {
      this.name = ''
      this.password = ''
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
  },
}
</script>

<style scoped>
.bg-login {
  background-image: url('@/assets/images/loginbg4.png');
  background-size: cover;
  min-height: 100vh;
}
.hero-login {
  padding-top: 60px;
  gap: 10rem;
}

.iminkitLogin {
  max-width: 100%;
  height: auto;
}

.loginForm {
  width: 50%;
}
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

.footer {
  margin-top: 20px;
}
.card-login {
  padding: 0 !important;
}

.loader {
  width: 18px;
  height: 18px;
  border: 5px solid #fff;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
