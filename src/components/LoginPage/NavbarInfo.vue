<template>
  <div class="container-fluid px-4">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid mt-2">
        <img :src="iminLogo" class="logoImin" alt="" />
        <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
          <ul class="navbar-nav fw-bold">
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                href="https://oss-sg.imin.sg/docs/en/index.html"
                target="_blank"
                >SDK & Document</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://imin.co.id/" target="_blank">Official Website</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://doc.imin.co.id/" target="_blank">Imin Store 2.0</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import iminLogo from '@/assets/images/logo2.png'

export default {
  name: 'NavbarInfo',
  data() {
    return {
      iminLogo,
    }
  },
}
</script>

<style scoped>
.logoImin {
  max-width: 100px;
}

@media (max-width: 575.98px) {
  .collapse {
    margin-top: -2.5rem;
  }
}
</style>
