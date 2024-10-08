<template>
  <div class="bg-login d-flex flex-column min-vh-100">
    <NavbarInfo />
    <div class="hero-login container-fluid d-flex justify-content-center align-items-center">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div
          class="col-12 col-md-6 col-lg-5 d-flex justify-content-center align-items-center mb-4 mb-md-0"
        >
          <img :src="loginbg3" class="iminkitLogin" alt="iminkit progress image" />
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="card shadow-lg p-3 mb-5 login-card">
            <div class="card-body">
              <h5 class="card-title text-center mb-4">Find Password</h5>
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <div class="input-group">
                    <input
                      id="email"
                      type="email"
                      class="form-control shadow-none"
                      :class="{ 'is-invalid': submitted && emailError }"
                      placeholder="Please enter email address"
                      v-model="email"
                    />
                  </div>
                  <div class="invalid-feedback">{{ emailError }}</div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-danger text-white">
                    <span v-if="loading" class="loader"></span>
                    <span v-else>Confirm</span>
                  </button>
                </div>
              </form>
              <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
                {{ successMessage }}
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
import { ref } from 'vue'
import axios from 'axios'
import loginbg3 from '@/assets/images/loginbg3.png'
import NavbarInfo from '../../components/LoginPage/NavbarInfo.vue'
import FooterFront from '../../components/Layouts/FooterFront.vue'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const emailError = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  submitted.value = true
  emailError.value = ''
  successMessage.value = ''

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    loading.value = false
    return
  }

  try {
    const response = await axios.post('/reset-password', {
      email: email.value,
    })
    successMessage.value = 'Reset password successfully'
    email.value = response.data
  } catch (error) {
    console.error('Forgot password failed:', error)
    emailError.value = 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
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
  width: 50rem;
}

.card {
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
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

@media (min-width: 992px) and (max-width: 1199.98px) {
  .hero-login {
    padding-top: 6rem;
  }
  .iminkitLogin {
    width: 40rem;
  }
  .login-card {
    margin-left: 6rem;
  }
}

@media (min-width: 1200px) {
  .hero-login {
    padding-top: 8rem;
  }
  .iminkitLogin {
    width: 50rem;
  }
  .login-card {
    width: 30rem;
    margin-left: 10rem;
  }
}
</style>
