<template>
  <div class="bg-register d-flex flex-column min-vh-100">
    <NavbarInfo />
    <div class="hero-register container-fluid d-flex justify-content-center align-items-center">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div
          class="col-12 col-md-6 col-lg-5 d-flex justify-content-center align-items-center mb-4 mb-md-0"
        >
          <img :src="loginbg3" class="iminkitRegister" alt="iminkit progress image" />
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="register-card shadow-lg mb-5">
            <div class="card-body">
              <h5 class="card-title text-center mb-4">Register iMin Service</h5>
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && nameError }"
                      placeholder="Please input name"
                      v-model="name"
                    />
                  </div>
                  <div class="invalid-feedback">
                    {{ nameError }}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && emailError }"
                      placeholder="Please input email address"
                      v-model="email"
                    />
                  </div>
                  <div class="invalid-feedback">
                    {{ emailError }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="input-group">
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && passwordError }"
                      placeholder="Please enter password"
                      v-model="password"
                    />
                    <span class="input-group-text" @click="togglePasswordVisibility">
                      <CIcon :icon="passwordVisible ? cilLockUnlocked : cilLockLocked" />
                    </span>
                  </div>
                  <div class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="input-group">
                    <input
                      :type="passwordConfirmVisible ? 'text' : 'password'"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && passwordError }"
                      placeholder="Please enter confirm password"
                      v-model="password_confirmation"
                    />
                    <span class="input-group-text" @click="toggleConfirmPasswordVisibility">
                      <CIcon :icon="passwordVisible ? cilLockUnlocked : cilLockLocked" />
                    </span>
                  </div>
                  <div class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>

                <div class="d-grid">
                  <p>
                    Already have an account?<router-link
                      to="/pages/login"
                      class="text-decoration-none"
                    >
                      Login</router-link
                    >
                  </p>
                  <button type="submit" class="btn btn-danger text-white">
                    <span v-if="loading" class="loader"></span>
                    <span v-else>Register</span>
                  </button>
                </div>
              </form>
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
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import loginbg3 from '@/assets/images/loginbg3.png'
import { showToast } from '@/utilities/toast'
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons'
import NavbarInfo from '../../components/LoginPage/NavbarInfo.vue'
import FooterFront from '../../components/Layouts/FooterFront.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)
const submitted = ref(false)
const passwordVisible = ref(false)
const passwordConfirmVisible = ref(false)
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')

const handleSubmit = () => {
  submitted.value = true
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''

  if (!validateName(name.value)) {
    nameError.value = 'Please enter your name'
  }

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
  }

  if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters long'
  }

  // Check if passwords match
  if (password.value !== password_confirmation.value) {
    passwordError.value = 'Passwords do not match'
  }

  if (!emailError.value && !passwordError.value) {
    getRegister()
  }
}

const validateName = (name) => {
  return name.trim().length > 0
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

const toggleConfirmPasswordVisibility = () => {
  passwordConfirmVisible.value = !passwordConfirmVisible.value
}

const getRegister = async () => {
  try {
    loading.value = true
    const response = await axios.post('register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })
    console.log('User registered successfully:', response.data.user)
    showToast('Registration successful. Login Now!', 'success')
    router.push({ name: 'LoginPage' })
  } catch (error) {
    showToast('Registration failed. Please try again!', 'error')
    console.error('Error registering user:', error.message)
  } finally {
    loading.value = false
    clearInput()
  }
}

const clearInput = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  password_confirmation.value = ''
}
</script>

<style scoped>
.bg-register {
  background-image: url('@/assets/images/loginbg4.png');
  background-size: cover;
}
.hero-register {
  height: 80vh;
}
.iminkitRegister {
  height: auto;
  width: 45rem;
}
.register-card {
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

.registerForm {
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
.card-register {
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
  .hero-register {
    flex-direction: column;
    text-align: center;
    height: auto;
  }
  .iminkitRegister {
    max-width: 80%;
    margin-bottom: 1rem;
  }
  .register-card {
    width: 100%;
    margin-left: 0;
  }
}

@media (min-width: 576px) and (max-width: 991.98px) {
  .hero-register {
    padding: 2rem;
  }
  .iminkitRegister {
    width: 80%;
  }
  .register-card {
    width: 100%;
    margin-left: 2rem;
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .hero-register {
    padding-top: 6rem;
  }
  .iminkitRegister {
    width: 40rem;
  }
  .register-card {
    margin-left: 6rem;
  }
}

@media (min-width: 1200px) and (max-width: 1399.98px) {
  .hero-register {
    height: 75vh;
  }
  .iminkitRegister {
    height: auto;
    width: 40rem;
  }
  .register-card {
    position: fixed;
    width: 30%;
    margin-left: 22rem;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
}
</style>
