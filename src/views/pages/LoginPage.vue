<template>
  <div class="bg-login d-flex flex-column min-vh-100">
    <NavbarInfo />
    <div class="hero-login d-flex justify-content-center align-items-center">
      <div class="d-flex flex-column flex-md-row justify-content-between">
        <div
          class="col-12 col-md-6 col-lg-5 d-flex justify-content-center align-items-center mb-4 mb-md-0"
        >
          <img :src="loginbg3" class="iminkitLogin" alt="iminkit progress image" />
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="login-card shadow-lg mb-5">
            <div class="card-body">
              <h5 class="card-title text-center mb-4">Login</h5>
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && (emailError || serverErrors.email) }"
                      placeholder="Please enter account ID/email address"
                      v-model="email"
                      autocomplete="email"
                    />
                  </div>
                  <div class="invalid-feedback" v-if="emailError">
                    {{ emailError }}
                  </div>
                  <div class="invalid-feedback" v-if="serverErrors.email">
                    {{ serverErrors.email[0] }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="input-group">
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      class="form-control shadow-none"
                      :class="{
                        'is-invalid': submitted && (passwordError || serverErrors.password),
                      }"
                      placeholder="Please enter password"
                      v-model="password"
                    />
                    <span
                      class="input-group-text"
                      @click="togglePasswordVisibility"
                      style="cursor: pointer"
                    >
                      <CIcon :icon="passwordVisible ? cilLockUnlocked : cilLockLocked" />
                    </span>
                  </div>
                  <div class="invalid-feedback" v-if="passwordError">
                    {{ passwordError }}
                  </div>
                  <div class="invalid-feedback" v-if="serverErrors.password">
                    {{ serverErrors.password[0] }}
                  </div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-danger text-white" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <span>{{ loading ? 'Logging in...' : 'Confirm' }}</span>
                  </button>
                </div>
              </form>

              <div class="d-flex justify-content-between mt-3">
                <router-link to="/pages/register" class="text-primary text-decoration-none">
                  Register
                </router-link>
                <router-link to="/pages/forgotpassword" class="text-primary text-decoration-none">
                  Forgot password
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-4">
      <FooterFront />
    </footer>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import axios from 'axios'
import loginbg3 from '@/assets/images/loginbg3.png'
import { useRouter } from 'vue-router'
import { showToast } from '@/utilities/toast'
import { CIcon } from '@coreui/icons-vue'
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons'
import NavbarInfo from '../../components/LoginPage/NavbarInfo.vue'
import FooterFront from '../../components/Layouts/FooterFront.vue'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const password = ref('')
const passwordVisible = ref(false)
const emailError = ref('')
const passwordError = ref('')
const serverErrors = ref({})
const router = useRouter()

// Get the app instance to access global properties
const app = getCurrentInstance()
const $auth = app?.appContext.config.globalProperties.$auth

const handleSubmit = () => {
  submitted.value = true
  emailError.value = ''
  passwordError.value = ''
  serverErrors.value = {}

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
  }

  if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters long'
  }

  if (!emailError.value && !passwordError.value) {
    getLogin()
  }
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password.length >= 6
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const getLogin = async () => {
  try {
    loading.value = true

    // Clear any existing session before login attempt
    if ($auth) {
      $auth.clearSession()
    }

    const response = await axios.post('login', {
      email: email.value,
      password: password.value,
    })

    const token = response.data.token
    const user = response.data.users

    // Use the $auth service to set token with expiry
    if ($auth) {
      const success = $auth.setToken(token)
      console.log('Token set successfully:', success)
      console.log('Expiry time:', $auth.getExpiryTime())
    } else {
      // Fallback if $auth is not available
      console.log('$auth not available, using localStorage directly')
      localStorage.setItem('token', token)
    }

    localStorage.setItem('users', JSON.stringify(user))
    showToast('Login successfully', 'success')

    // Short delay before redirecting to ensure token is set
    setTimeout(() => {
      router.push({ name: 'Dashboard' })
    }, 100)
  } catch (error) {
    console.error('Login error:', error)

    if (error.response) {
      const { data, status } = error.response

      if (status === 422) {
        // Validation errors
        serverErrors.value = data.errors || {}

        // Handle specific error messages
        if (data.errors?.email?.[0]?.includes('email does not exist')) {
          showToast('Email is not registered', 'error')
        } else if (data.errors?.password?.[0]?.includes('incorrect password')) {
          showToast('Incorrect password', 'error')
        }
      } else {
        showToast(`Login failed (${status}). Please try again later.`, 'error')
      }
    } else if (error.request) {
      // Request was made but no response received
      showToast('Server not responding. Please check your connection.', 'error')
    } else {
      // Something happened in setting up the request
      showToast(`Login error: ${error.message}`, 'error')
    }
    clearInput()
  } finally {
    loading.value = false
  }
}

const clearInput = () => {
  email.value = ''
  password.value = ''
  submitted.value = false
}
</script>

<style scoped>
.bg-login {
  background-image: url('@/assets/images/loginbg4.png');
  background-size: cover;
}
.hero-login {
  height: 80vh;
}
.iminkitLogin {
  height: auto;
  width: 45rem;
}
.login-card {
  padding: 2rem;
  width: 30rem;
  margin-left: 22rem;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.input-group-text {
  background-color: white;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.text-primary {
  color: #007bff !important;
}

.invalid-feedback {
  display: block;
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

@media (max-width: 575.98px) {
  .hero-login {
    flex-direction: column;
    text-align: center;
    height: auto;
  }
  .iminkitLogin {
    max-width: 80%;
    margin-bottom: 1rem;
  }
  .login-card {
    width: 100%;
    margin-left: 0;
  }
}

@media (min-width: 576px) and (max-width: 991.98px) {
  .hero-login {
    padding: 2rem;
  }
  .iminkitLogin {
    width: 80%;
  }
  .login-card {
    width: 100%;
    margin-left: 2rem;
  }
}

@media (min-width: 1200px) and (max-width: 1399.98px) {
  .hero-login {
    height: 75vh;
  }
  .iminkitLogin {
    height: auto;
    width: 40rem;
  }
  .login-card {
    position: fixed;
    width: 30%;
    margin-left: 22rem;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
}
</style>
